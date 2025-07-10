"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { message } from "antd";
import useSWR from "swr";

const codeLoginFetcher = async (): Promise<any> => {
  const response = await fetch("/api/wechat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "code" }),
  });
  return response.json();
};

const codeStatusFetcher = async (code: string): Promise<any> => {
  const response = await fetch("/api/wechat", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  return response.json();
};

interface CodeLoginProps {
  onSuccess?: () => void;
}

export default function CodeLogin({ onSuccess }: CodeLoginProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 获取验证码 - 直接激活
  const {
    data: codeData,
    error: codeError,
    mutate: mutateCode,
  } = useSWR("codeLogin", codeLoginFetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  // 检查登录状态
  const {
    data: loginStatus,
    error: loginError,
    mutate: mutateStatus,
  } = useSWR(
    codeData?.code ? ["codeStatus", codeData.code] : null,
    () => codeStatusFetcher(codeData.code),
    {
      refreshInterval: () => (!isLoggingIn ? 2000 : 0),
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
    }
  );

  // 监听登录状态
  useEffect(() => {
    if (
      loginStatus?.status === "authorized" &&
      loginStatus?.openid &&
      !isLoggingIn
    ) {
      console.log("验证码登录成功，正在登录...", loginStatus);
      setIsLoggingIn(true);
      messageApi.success("登录成功！");

      setTimeout(() => {
        signIn("credentials", {
          openid: loginStatus.openid,
          redirect: true,
          callbackUrl: "/community",
        });
      }, 100);
    } else if (loginStatus?.status === "expired") {
      messageApi.warning("验证码已过期，请重新获取");
      mutateCode(); // 重新获取验证码
    }
  }, [loginStatus, isLoggingIn, messageApi]);

  // 页面可见性处理
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && codeData?.code) {
        mutateStatus();
      }
    };

    const handleFocus = () => {
      if (codeData?.code) {
        mutateStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [codeData?.code, mutateStatus]);

  const handleRefreshCode = () => {
    mutateCode();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        messageApi.success("验证码已复制到剪贴板");
      })
      .catch(() => {
        messageApi.error("复制失败，请手动复制");
      });
  };

  return (
    <div className="flex-1 flex flex-col space-y-2">
      {contextHolder}

      {codeData?.code ? (
        <div className="text-center space-y-2">
          {/* 显示图片 - 超小 */}
          <div className="flex justify-center">
            <img
              src="/images/hxzy.jpg"
              alt="华夏中医"
              className="w-36 h-36 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* 验证码显示区域 - 超紧凑左右结构 */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-2">
            <div className="flex items-center gap-2">
              {/* 左侧：验证码显示 */}
              <div className="flex-1">
                <div className="bg-white rounded p-2 shadow-sm">
                  <div className="text-lg font-mono font-bold text-gray-800 tracking-wider text-center">
                    {codeData.code}
                  </div>
                </div>
              </div>

              {/* 右侧：操作按钮 */}
              <div className="flex gap-1">
                <button
                  onClick={() => copyToClipboard(codeData.code)}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  📋
                </button>
                <button
                  onClick={handleRefreshCode}
                  className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                >
                  🔄
                </button>
              </div>
            </div>

            {/* 底部：简化的提示和状态 */}
            <div className="mt-2 pt-1 border-t border-blue-200 flex items-center justify-between text-xs">
              <span className="text-gray-600 text-center mx-auto">发送到微信公众号</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  loginStatus?.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : loginStatus?.status === "authorized"
                      ? "bg-green-100 text-green-700"
                      : loginStatus?.status === "expired"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                }`}
              >
                {loginStatus?.status === "pending" && "⏳ 等待"}
                {loginStatus?.status === "authorized" && "✅ 成功"}
                {loginStatus?.status === "expired" && "⏰ 过期"}
                {!loginStatus?.status && "🔄 等待"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <div className="w-8 h-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500">生成验证码中...</p>
        </div>
      )}

      {codeError && (
        <div className="text-center text-xs text-red-600">
          获取失败: {codeError.message}
        </div>
      )}
    </div>
  );
}
