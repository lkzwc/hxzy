import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// 存储登录状态的Map
const loginStateMap = new Map<
  string,
  {
    status: "pending" | "scanned" | "authorized";
    openid?: string;
  }
>();

function generateReplyMessage(toUser: string, fromUser: string, content: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    return `<xml>
      <ToUserName><![CDATA[${toUser}]]></ToUserName>
      <FromUserName><![CDATA[${fromUser}]]></FromUserName>
      <CreateTime>${timestamp}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
    </xml>`;
  }

// 验证消息签名
function verifySignature(
  timestamp: string,
  nonce: string,
  signature: string
): boolean {
  try {
    const token = process.env.WECHAT_TOKEN;
    if (!token) {
      console.error("WECHAT_TOKEN not found in environment variables");
      return false;
    }

    // 1. 将 token、timestamp、nonce 三个参数进行字典序排序
    const tmpArr = [token, timestamp, nonce].sort();

    // 2. 将三个参数字符串拼接成一个字符串进行 sha1 加密
    const tmpStr = tmpArr.join("");
    const shasum = crypto.createHash("sha1");
    shasum.update(tmpStr);
    const hash = shasum.digest("hex");

    // 3. 开发模式下输出日志便于调试
    console.log("Verification params:", {
      token,
      timestamp,
      nonce,
      signature,
      calculated: hash,
    });

    // 4. 将加密后的字符串与 signature 对比
    return hash === signature;
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

async function handleWeChatMessage(xmlData: string) {
  try {
    // 1. 解析XML数据
    const result = await parseStringPromise(xmlData);
    const message = result.xml;

    // 2. 提取消息基本信息
    const toUserName = message.ToUserName[0]; // 开发者微信号
    const fromUserName = message.FromUserName[0]; // 用户的OpenID
    const createTime = message.CreateTime[0]; // 消息创建时间
    const msgType = message.MsgType[0]; // 消息类型

    console.log("收到微信消息:", {
      toUserName,
      fromUserName,
      createTime,
      msgType,
      message,
    });

    // 3. 处理事件消息
    if (msgType === "event") {
      const event = message.Event[0];
      const eventKey = message.EventKey?.[0] || "";
      const ticket = message.Ticket?.[0];

      switch (event.toUpperCase()) {
        case "SCAN": // 已关注用户扫码
          await handleScanEvent(fromUserName, eventKey, ticket);
          break;

        case "SUBSCRIBE": // 未关注用户扫码关注
          if (eventKey.startsWith("qrscene_")) {
            // 提取场景值
            const sceneStr = eventKey.replace("qrscene_", "");
            await handleScanEvent(fromUserName, sceneStr, ticket);
          }
          // 发送欢迎消息
          return new Response(
            generateReplyMessage(
              fromUserName,
              toUserName,
              "感谢关注！请继续完成登录操作。"
            )
          );
          break;
      }
    }

    // 4. 返回成功响应
    return new Response("success");
  } catch (error) {
    console.error("处理微信消息失败:", error);
    // 即使处理失败也要返回success，避免微信服务器重试
    return new Response("success");
  }
}

async function getAccessToken() {
  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.access_token;
}

// 获取微信二维码
async function createLoginQrCode(request: NextRequest) {
  // 判断是微信服务器推送还是前端请求
  try {
    const accessToken = await getAccessToken();

    // 生成唯一的场景值作为登录标识
    const sceneStr = `login_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;

    // 创建二维码ticket
    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`,
      {
        method: "POST",
        body: JSON.stringify({
          expire_seconds: 300, // 5分钟有效期
          action_name: "QR_STR_SCENE",
          action_info: {
            scene: { scene_str: sceneStr },
          },
        }),
      }
    );

    console.log("response", accessToken,response);

    if (!response.ok) {
      throw new Error("获取二维码ticket失败");
    }

    const { ticket, expire_seconds } = await response.json();

    // 初始化登录状态
    loginStateMap.set(ticket, { status: "pending" });

    // 5分钟后清除登录状态
    setTimeout(() => {
      loginStateMap.delete(ticket);
    }, 300 * 1000);

    return NextResponse.json({
      sceneStr,
      loginCode: ticket,
      expireSeconds: expire_seconds,
      qrCodeUrl: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(ticket)}`
    });
  } catch (error) {
    console.error("生成登录二维码失败:", error);
    return NextResponse.json({ error: "生成登录二维码失败" }, { status: 500 });
  }
}

async function handleScanEvent(
  openid: string,
  sceneStr: string,
  ticket?: string
) {
  try {
    // 1. 获取登录状态
    const loginState = loginStateMap.get(sceneStr);
    if (!loginState) {
      console.warn("登录状态不存在:", sceneStr);
      return;
    }

    // 2. 更新登录状态
    loginState.status = "authorized";
    loginState.openid = openid;
    loginStateMap.set(sceneStr, loginState);

    // 3. 查找或创建用户
    const user = await prisma.user.upsert({
      where: { openid },
      create: {
        openid,
        lastLoginAt: new Date(),
      },
      update: {
        lastLoginAt: new Date(),
      },
    });

    console.log("用户扫码成功:", {
      openid,
      sceneStr,
      userId: user.id,
    });
  } catch (error) {
    console.error("处理扫码事件失败:", error);
  }
}

// 处理服务器验证
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const signature = searchParams.get("signature");
    const timestamp = searchParams.get("timestamp");
    const nonce = searchParams.get("nonce");
    const echostr = searchParams.get("echostr");

    console.log("Received verification request:", {
      signature,
      timestamp,
      nonce,
      echostr,
    });

    if (!signature || !timestamp || !nonce || !echostr) {
      console.error("Missing required parameters");
      return new NextResponse("missing params", { status: 400 });
    }

    const isValid = verifySignature(timestamp, nonce, signature);

    if (isValid) {
      return new NextResponse(echostr);
    } else {
      return new NextResponse("invalid signature", { status: 401 });
    }
  } catch (error) {
    console.error("Verification request failed:", error);
    return new NextResponse("server error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 判断是微信服务器推送还是前端请求
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("xml")) {
      // 处理微信服务器的XML推送
      const xmlData = await request.text();
      console.log("收到微信消息:", xmlData);
      return handleWeChatMessage(xmlData);
    } else {
      // 处理前端获取二维码的请求
      return createLoginQrCode(request);
    }
  } catch (error) {
    console.error("处理请求失败:", error);
    return NextResponse.json({ error: "处理请求失败" }, { status: 500 });
  }
}
