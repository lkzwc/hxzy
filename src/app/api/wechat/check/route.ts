import { NextRequest, NextResponse } from "next/server";
import { loginStateManager } from "@/lib/loginState";

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sceneStr = searchParams.get("sceneStr");

    if (!sceneStr) {
      return NextResponse.json(
        { error: "缺少场景值" },
        { status: 400 }
      );
    }

    // 获取登录状态
    const loginState = loginStateManager.getLoginState(sceneStr);
    
    if (!loginState) {
      return NextResponse.json(
        { error: "登录状态不存在或已过期" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: loginState.status,
      openid: loginState.openid
    });

  } catch (error) {
    console.error("检查登录状态失败:", error);
    return NextResponse.json(
      { error: "检查登录状态失败" },
      { status: 500 }
    );
  }
} 