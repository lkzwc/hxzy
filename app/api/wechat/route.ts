import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { createLoginToken } from "@/lib/loginState";

const authorityURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WECHAT_APP_ID}&redirect_uri=${process.env.WECHAT_TREDIRECT_URL}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;

// 统一的登录状态管理
const loginStateMap = new Map<
  string,
  {
    type: "qr" | "code";
    loginToken?: string;
    timestamp: number;
    status: "pending" | "authorized" | "expired";
    openid?: string;
  }
>();

function generateReplyMessage(
  toUser: string,
  fromUser: string,
  content: string
) {
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
    const tmpArr = [token, timestamp, nonce].sort((a, b) => (a < b ? -1 : 1));

    // 2. 将三个参数字符串拼接成一个字符串进行 sha1 加密
    const tmpStr = tmpArr.join("");
    const hash = crypto
      .createHash("sha1")
      .update(tmpArr.join(""))
      .digest("hex");

    // 4. 将加密后的字符串与 signature 对比
    return hash === signature;
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

async function handleWeChatMessage(xmlData: string) {
  console.log("收到推送消息",xmlData)
  try {
    // 1. 解析XML数据
    const result = await parseStringPromise(xmlData);
    const message = result.xml;

    // 2. 提取消息基本信息
    const toUserName = message.ToUserName[0]; // 开发者微信号
    const fromUserName = message.FromUserName[0]; // 用户的OpenID
    const msgType = message.MsgType[0]; // 消息类型

    // 3. 处理文本消息（验证码登录）
    if (msgType === "text") {
      const content = message.Content[0].trim();

      // 检查是否是6位数字验证码
      if (/^\d{6}$/.test(content)) {
        const loginData = loginStateMap.get(content);

        if (
          loginData &&
          loginData.type === "code" &&
          loginData.status === "pending"
        ) {
          // 验证码有效期检查（5分钟）
          if (Date.now() - loginData.timestamp < 5 * 60 * 1000) {
            // 更新登录状态
            loginData.status = "authorized";
            loginData.openid = fromUserName;
            loginStateMap.set(content, loginData);

            console.log("验证码登录成功:", {
              code: content,
              openid: fromUserName,
            });

            return new Response(
              generateReplyMessage(
                fromUserName,
                toUserName,
                "验证码验证成功！登录完成，请返回浏览器继续操作。"
              )
            );
          } else {
            // 验证码已过期
            loginData.status = "expired";
            loginStateMap.set(content, loginData);
            return new Response(
              generateReplyMessage(
                fromUserName,
                toUserName,
                "验证码已过期，请重新获取验证码。"
              )
            );
          }
        } else {
          return new Response(
            generateReplyMessage(
              fromUserName,
              toUserName,
              "验证码无效或已使用，请重新获取验证码。"
            )
          );
        }
      } else {
        // 不是验证码格式，返回使用说明
        return new Response(
          generateReplyMessage(
            fromUserName,
            toUserName,
            "请发送6位数字验证码进行登录。如需获取验证码，请访问登录页面。"
          )
        );
      }
    }

    // 3. 处理事件消息
    if (msgType === "event") {
      const event = message.Event[0];
      const eventKey = message.EventKey?.[0] || "";
      const ticket = message.Ticket?.[0];

      // 提取场景值，处理未关注用户的情况
      const sceneStr = eventKey.startsWith("qrscene_")
        ? eventKey.replace("qrscene_", "")
        : eventKey;

      try {
        // 获取存储的登录状态
        const loginData = loginStateMap.get(sceneStr);
        if (!loginData || loginData.type !== "qr") {
          throw new Error("QR login state not found");
        }

        switch (event.toUpperCase()) {
          case "SCAN": // 已关注用户扫码
          case "SUBSCRIBE": // 未关注用户扫码关注
            if (fromUserName) {
              // 更新登录状态为已授权
              loginData.status = "authorized";
              loginData.openid = fromUserName;
              loginStateMap.set(sceneStr, loginData);
            }

            const replyMessage =
              event.toUpperCase() === "SUBSCRIBE"
                ? `感谢关注！请<a href="${authorityURL}">授权登录</a>`
                : `登陆成功！请<a href="${authorityURL}">点击授权跳转</a>`;

            return new Response(
              generateReplyMessage(fromUserName, toUserName, replyMessage)
            );
        }
      } catch (error) {
        console.error("处理扫码事件失败:", error);
        return new Response(
          generateReplyMessage(
            fromUserName,
            toUserName,
            "登录失败，请重新扫码。"
          )
        );
      }
    }

    // 4. 返回成功响应
    return new Response("success");
  } catch (error) {
    console.error("处理微信消息失败:", error || "Unknown error");
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

// 生成验证码登录
async function createCodeLogin() {
  try {
    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 创建登录令牌
    const loginToken = createLoginToken(code);

    // 存储验证码和登录信息
    loginStateMap.set(code, {
      type: "code",
      loginToken,
      timestamp: Date.now(),
      status: "pending",
    });

    console.log("生成验证码登录:", { code, loginToken });

    return NextResponse.json({
      code,
      loginToken,
      expireSeconds: 300, // 5分钟有效期
      message: "请将此验证码发送到微信公众号完成登录",
    });
  } catch (error) {
    console.error("生成验证码登录失败:", error || "Unknown error");
    return NextResponse.json({ error: "生成验证码失败" }, { status: 500 });
  }
}

// 获取微信二维码
async function createLoginQrCode(request: NextRequest) {
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

    if (!response.ok) {
      throw new Error("获取二维码ticket失败");
    }

    const { ticket, expire_seconds } = await response.json();

    // 创建登录令牌并存储映射关系【绑定场景值 和 token】
    const loginToken = createLoginToken(sceneStr);
    loginStateMap.set(sceneStr, {
      type: "qr",
      loginToken,
      timestamp: Date.now(),
      status: "pending",
    });

    console.log("创建登录二维码:", {
      sceneStr,
      loginToken,
      expire_seconds,
    });

    return NextResponse.json({
      sceneStr,
      loginToken,
      loginCode: ticket,
      expireSeconds: expire_seconds,
      qrCodeUrl: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(
        ticket
      )}`,
    });
  } catch (error) {
    console.error("生成登录二维码失败:", error || "Unknown error");
    return NextResponse.json({ error: "生成登录二维码失败" }, { status: 500 });
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

    console.log("timestampxx", timestamp, nonce, echostr, signature);

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

// 处理服务器转发的消息
export async function POST(request: NextRequest) {
  try {
    // 判断是微信服务器推送还是前端请求
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("xml")) {
      // 处理微信服务器的XML推送
      const xmlData = await request.text();
      console.log("服务器推送message:", xmlData);
      return handleWeChatMessage(xmlData);
    } else {
      // 处理前端请求
      const body = await request.json().catch(() => ({}));

      if (body.type === "code") {
        // 生成验证码登录
        return createCodeLogin();
      } else {
        // 默认生成二维码登录
        return createLoginQrCode(request);
      }
    }
  } catch (error) {
    console.error("处理请求失败:", error || "Unknown error");
    return NextResponse.json({ error: "处理请求失败" }, { status: 500 });
  }
}

// 状态轮训
export async function PUT(request: NextRequest) {
  try {
    const { sceneStr, code } = await request.json();

    // 如果是验证码登录
    if (code) {
      console.log("检查验证码登录状态:", { code });

      const loginData = loginStateMap.get(code);
      if (!loginData || loginData.type !== "code") {
        return NextResponse.json(
          {
            status: "pending",
            error: "Code not found",
          },
          { status: 200 }
        );
      }

      // 检查是否过期
      if (Date.now() - loginData.timestamp > 5 * 60 * 1000) {
        loginData.status = "expired";
        loginStateMap.set(code, loginData);
        return NextResponse.json(
          {
            status: "expired",
            error: "Code expired",
          },
          { status: 200 }
        );
      }

      const result = {
        status: loginData.status,
        code,
        openid: loginData.openid,
      };

      console.log("验证码登录状态检查结果:", result);
      return NextResponse.json(result);
    }

    // 原有的二维码登录逻辑
    console.log("检查二维码登录状态:", { sceneStr });

    if (sceneStr) {
      const loginData = loginStateMap.get(sceneStr);
      if (!loginData || loginData.type !== "qr") {
        console.log("未找到对应的登录状态:", sceneStr);
        return NextResponse.json(
          {
            status: "pending",
            error: "QR login state not found",
          },
          { status: 200 }
        );
      }

      // 检查是否过期
      if (Date.now() - loginData.timestamp > 5 * 60 * 1000) {
        loginData.status = "expired";
        loginStateMap.set(sceneStr, loginData);
        return NextResponse.json(
          {
            status: "expired",
            error: "QR code expired",
          },
          { status: 200 }
        );
      }

      const result = {
        status: loginData.status,
        sceneStr,
        openid: loginData.openid,
      };

      console.log("二维码登录状态检查结果:", result);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("检查登录状态失败:", error || "Unknown error");
    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: "pending",
          error: error.message,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        status: "pending",
        error: "Invalid login token",
      },
      { status: 200 }
    );
  }
}
