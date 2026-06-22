"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { message } from "antd";

interface EmailLoginProps {
  onSuccess?: () => void;
}

export default function EmailLogin({ onSuccess }: EmailLoginProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 发送邮箱验证码
  const sendEmailCode = async () => {
    if (!email || !email.includes("@")) {
      messageApi.warning("请输入有效的邮箱地址");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setCodeSent(true);
        messageApi.success("验证码已发送到您的邮箱");
      } else {
        messageApi.error(data.error || "发送验证码失败，请重试");
      }
    } catch (error) {
      messageApi.error("发送验证码失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code) {
      messageApi.warning("请输入邮箱和验证码");
      return;
    }

    if (code.length !== 6) {
      messageApi.warning("请输入6位验证码");
      return;
    }

    setIsLoading(true);
    try {
      // 先向服务端验证验证码是否正确
      const verifyResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        messageApi.error(verifyData.error || "验证码错误，请重新输入");
        setIsLoading(false);
        return;
      }

      // 验证通过，执行登录
      await signIn("credentials", {
        email: email,
        callbackUrl: "/community",
      });
      messageApi.success("登录成功");
      onSuccess?.();
    } catch (error) {
      messageApi.error("登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {contextHolder}

      <form onSubmit={handleLogin} className="space-y-5">
        {/* 邮箱输入 */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="email"
              placeholder="请输入您的邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-4 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white transition-all duration-200 placeholder-gray-400"
              disabled={isLoading}
            />
            {email && email.includes("@") && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-green-500 text-lg">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* 验证码输入和发送按钮 */}
        <div className="space-y-2">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="请输入6位验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="w-full h-12 pl-4 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-secondary-500 focus:ring-2 focus:ring-secondary-100 bg-white transition-all duration-200 placeholder-gray-400"
                disabled={isLoading}
              />
              {code && code.length === 6 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-green-500 text-lg">✓</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={sendEmailCode}
              disabled={isLoading || !email || !email.includes("@")}
              className="px-6 h-12 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-xl hover:from-primary-600 hover:to-secondary-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  发送中
                </>
              ) : (
                <>
                  <span>📤</span>
                  发送验证码
                </>
              )}
            </button>
          </div>
        </div>

        {/* 登录按钮 */}
        <button
          type="submit"
          disabled={isLoading || !email || !code || code.length !== 6}
          className="w-full h-12 bg-gradient-to-r from-primary-600 to-accent-700 text-white rounded-xl hover:from-primary-700 hover:to-accent-800 transition-all duration-300 text-base font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              登录中...
            </>
          ) : (
            <>
              <span>🚀</span>
              立即登录
            </>
          )}
        </button>


        {/* 状态指示器 */}
        {codeSent && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></span>
              验证码已发送到您的邮箱
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
