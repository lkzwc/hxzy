import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// 延迟初始化 Resend 客户端，避免模块加载时因缺少环境变量而崩溃
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY 环境变量未配置");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// 服务端验证码存储（生产环境建议迁移到 Redis）
const emailVerificationStore = new Map<
  string,
  { code: string; timestamp: number; attempts: number }
>();

// 发送频率限制：同一邮箱 60 秒内只能发一次
const RATE_LIMIT_MS = 60 * 1000;
// 验证码有效期：5 分钟
const CODE_EXPIRY_MS = 5 * 60 * 1000;
// 最大验证尝试次数
const MAX_ATTEMPTS = 5;

// 定期清理过期条目，防止内存泄漏
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of emailVerificationStore.entries()) {
    if (now - value.timestamp > CODE_EXPIRY_MS) {
      emailVerificationStore.delete(key);
    }
  }
}, 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    // 基本邮箱格式校验
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "请输入有效的邮箱地址" },
        { status: 400 }
      );
    }

    // 如果请求中包含 code，则为验证模式
    if (code) {
      const stored = emailVerificationStore.get(email);

      if (!stored) {
        return NextResponse.json(
          { error: "请先获取验证码" },
          { status: 400 }
        );
      }

      // 检查尝试次数
      if (stored.attempts >= MAX_ATTEMPTS) {
        emailVerificationStore.delete(email);
        return NextResponse.json(
          { error: "验证次数过多，请重新获取验证码" },
          { status: 429 }
        );
      }

      stored.attempts += 1;

      // 检查过期
      if (Date.now() - stored.timestamp > CODE_EXPIRY_MS) {
        emailVerificationStore.delete(email);
        return NextResponse.json(
          { error: "验证码已过期，请重新获取" },
          { status: 400 }
        );
      }

      // 校验验证码
      if (stored.code !== String(code).trim()) {
        return NextResponse.json(
          { error: "验证码错误" },
          { status: 400 }
        );
      }

      // 验证成功，清除验证码
      emailVerificationStore.delete(email);
      return NextResponse.json({ verified: true });
    }

    // 发送验证码模式
    // 频率限制
    const existing = emailVerificationStore.get(email);
    if (existing && Date.now() - existing.timestamp < RATE_LIMIT_MS) {
      const waitSeconds = Math.ceil(
        (RATE_LIMIT_MS - (Date.now() - existing.timestamp)) / 1000
      );
      return NextResponse.json(
        { error: `发送过于频繁，请 ${waitSeconds} 秒后重试` },
        { status: 429 }
      );
    }

    // 生成 6 位随机验证码
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 存储验证码到服务端
    emailVerificationStore.set(email, {
      code: verificationCode,
      timestamp: Date.now(),
      attempts: 0,
    });

    await getResendClient().emails.send({
      from: "admin@hxzy.life",
      to: [email],
      subject: "【华夏中医】邮箱验证码",
      html: `<div>
            <h1>华夏中医</h1>
            <p>您的邮箱验证码是：</p>
            <h2 style="letter-spacing: 4px; color: #b45309;">${verificationCode}</h2>
            <p style="color: #666;">验证码有效期为 5 分钟，请勿泄露给他人。</p>
            </div>`,
    });

    // 响应中不返回任何验证码相关信息
    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("发送验证码失败:", error);
    return NextResponse.json(
      { error: "发送验证码失败，请稍后重试" },
      { status: 500 }
    );
  }
}
