import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const MAILKEY = "re_dyoQL6oe_5bfQFt7oHp8xQbn9SD6pKy2F";
const resend = new Resend(MAILKEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const time = new Date().getTime();
    const codeS = Math.random() * time;
    const code = Math.floor(101010 + codeS / 1000000);

    const res = await resend.emails.send({
      from: "admin@hxzy.life",
      to: [email],
      subject: "【华夏中医】hxzy.life",
      html: `<div>
            <h1>华夏中医</h1>
            <p>您的邮箱验证码是：<h2>${code}</h2></p>
            </div>`,
    });

    return NextResponse.json({
      time,
      res,
      codeS,
    });
  } catch (error) {
    return NextResponse.json({
      error: `发送验证码失败${error}`,
    });
  }
}
