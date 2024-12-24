import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hesjdivmsjoctuifjihx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlc2pkaXZtc2pvY3R1aWZqaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNDkzMTYsImV4cCI6MjA1MDYyNTMxNn0.CCvGp8V83L4ocOGlJAeYSHDQ7d0L0Ot0uGawL1CBpro';
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: '手机号和验证码不能为空' },
        { status: 400 }
      );
    }

    // 从 Supabase 验证码表中验证
    const { data: verificationData, error: verificationError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (verificationError || !verificationData) {
      return NextResponse.json(
        { success: false, message: '验证码无效或已过期' },
        { status: 401 }
      );
    }

    // 查找或创建用户
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ phone, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }
      user = newUser;
    }

    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        phone: user.phone,
        role: user.role || 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 删除已使用的验证码
    await supabase
      .from('verification_codes')
      .delete()
      .eq('phone', phone)
      .eq('code', code);

    return NextResponse.json({ 
      success: true, 
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}