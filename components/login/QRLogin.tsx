"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { QrcodeOutlined } from "@ant-design/icons";
import { message } from "antd";
import useSWR from "swr";
import Image from "next/image";

const qrCodeFetcher = async (): Promise<any> => {
  const response = await fetch("/api/wechat", {
    method: "POST",
  });
  return response.json();
};

const loginStatusFetcher = async (sceneStr: string): Promise<any> => {
  const response = await fetch("/api/wechat", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sceneStr }),
  });
  return response.json();
};

interface QRLoginProps {
  onSuccess?: () => void;
}

export default function QRLogin({ onSuccess }: QRLoginProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 获取二维码
  const { data: qrCode } = useSWR("qrCode", qrCodeFetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  // 检查登录状态
  const { data: loginStatus, mutate: mutateLoginStatus } = useSWR(
    qrCode?.loginToken ? ["loginStatus", qrCode.loginToken] : null,
    () => loginStatusFetcher(qrCode.sceneStr),
    {
      refreshInterval: () => !isLoggingIn ? 1000 : 0,
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      cancelOnUnmount: true,
    }
  );

  // 监听登录状态
  useEffect(() => {
    if (loginStatus?.status === "authorized" && loginStatus?.openid && !isLoggingIn) {
      console.log("微信扫码登录成功，正在登录...", loginStatus);
      setIsLoggingIn(true);
      messageApi.success("登录成功！");
      
      setTimeout(() => {
        signIn("credentials", {
          openid: loginStatus.openid,
          redirect: true,
          callbackUrl: "/community"
        });
      }, 100);
    }
  }, [loginStatus, isLoggingIn, messageApi]);

  // 页面可见性处理
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && qrCode?.sceneStr) {
        mutateLoginStatus();
      }
    };

    const handleFocus = () => {
      if (qrCode?.sceneStr) {
        mutateLoginStatus();
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && qrCode?.sceneStr) {
        setTimeout(() => {
          mutateLoginStatus();
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [qrCode?.sceneStr, mutateLoginStatus]);

  return (
    <div className="flex-1 flex flex-col">
      {contextHolder}
      
      {qrCode?.qrCodeUrl ? (
        <div className="text-center space-y-4">
          {/* 二维码显示 */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto bg-primary-50 rounded-xl flex items-center justify-center shadow-md border border-primary-100 p-2 transition-all duration-300 hover:shadow-lg">
            <Image
              src={qrCode.qrCodeUrl}
              alt="微信登录二维码"
              width={160}
              height={160}
              className="rounded-lg"
              unoptimized
            />
          </div>
          
          {/* 提示信息 */}
          <div className="text-xs text-gray-600">
            <p>使用微信扫描二维码关注公众号完成登录</p>
          </div>
          
          {/* 状态显示 */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              loginStatus?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              loginStatus?.status === 'authorized' ? 'bg-green-100 text-green-800' :
              loginStatus?.status === 'expired' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {loginStatus?.status === 'pending' && '⏳ 等待扫码'}
              {loginStatus?.status === 'authorized' && '✅ 扫码成功'}
              {loginStatus?.status === 'expired' && '⏰ 已过期'}
              {!loginStatus?.status && '🔄 等待中'}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto bg-primary-50 rounded-xl flex items-center justify-center shadow-md border border-primary-100 animate-pulse">
            <QrcodeOutlined className="w-20 h-20 text-primary" />
          </div>
          <p className="text-sm text-gray-500 mt-3">正在生成二维码...</p>
        </div>
      )}
    </div>
  );
}
