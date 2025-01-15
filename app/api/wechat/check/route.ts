import { NextRequest, NextResponse } from "next/server";
import { verifyLoginToken } from "@/lib/loginState";

export async function POST(request: NextRequest) {
  try {
    const { loginToken, sceneStr } = await request.json();

    if (!loginToken) {
      return NextResponse.json(
        { error: "Missing login token" },
        { status: 400 }
      );
    }

    try {
      const loginState = verifyLoginToken(loginToken, sceneStr);
      return NextResponse.json(loginState);
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      return NextResponse.json({ error: "Invalid login token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 