import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hesjdivmsjoctuifjihx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlc2pkaXZtc2pvY3R1aWZqaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNDkzMTYsImV4cCI6MjA1MDYyNTMxNn0.CCvGp8V83L4ocOGlJAeYSHDQ7d0L0Ot0uGawL1CBpro';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    // 1. 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: '手机号格式错误' },
        { status: 400 }
      );
    }

    // 2. 检查是否有未过期的验证码
    const { data: existingCode } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (existingCode) {
      return NextResponse.json(
        { success: false, message: '验证码已发送，请稍后再试' },
        { status: 400 }
      );
    }

    // 3. 生成新的验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5分钟后过期

    // 4. 存储验证码到 Supabase
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert([
        {
          phone,
          code,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      throw insertError;
    }

    // 5. 调用短信服务发送验证码（这里需要集成实际的短信服务）
    // await sendSMS(phone, code);

    // 开发环境直接返回验证码
    console.log(`手机号：${phone} 验证码：${code}`);

    return NextResponse.json({ 
      success: true,
      message: '验证码已发送',
      code: code, // 仅在开发环境返回验证码
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { success: false, message: '发送验证码失败' },
      { status: 500 }
    );
  }
}