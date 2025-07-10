"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import QRLogin from "@/components/login/QRLogin";
import CodeLogin from "@/components/login/CodeLogin";
import EmailLogin from "@/components/login/EmailLogin";
import SocialLogin from "@/components/login/SocialLogin";

const methods = [
  // { key: "qr", label: "扫码登录", icon: "📱" },
  { key: "code", label: "验证码登录", icon: "🔢" },
  { key: "email", label: "邮箱登录", icon: "📧" },
] as const;

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<"qr" | "code" | "email">("code");
  const router = useRouter();
  const { data: session } = useSession();

  // 如果已登录，跳转到社区页面
  useEffect(() => {
    if (session) {
      router.push("/community");
    }
  }, [session, router]);

  const handleClose = () => {
    router.push("/");
  };

  const handleLoginSuccess = () => {
    router.push("/community");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-[320px] sm:w-auto">
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group border border-neutral-200 hover:border-red-200"
          title="关闭登录窗口"
        >
          <CloseOutlined className="w-5 h-5 text-neutral-600 group-hover:text-red-500 transition-colors duration-200" />
        </button>

        <div className="bg-neutral-50 rounded-2xl flex overflow-hidden shadow-2xl w-full sm:w-[750px] relative">
          <div className="hidden sm:flex w-[280px] bg-gradient-to-b from-primary-600 to-primary-800 p-8 text-white flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute inset-0 bg-[url('/images/chinese-pattern.png')] bg-repeat opacity-20"></div>
            </div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                华夏中医
                <br />
                传承千年
              </h1>
              <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
                上医治未病
                <br />
                中医治欲病
                <br />
                下医治已病
              </p>
            </div>
          </div>

          <div className="flex-1 px-6 sm:px-12 py-6 sm:py-8 flex flex-col">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-center text-primary">
                欢迎来到华夏中医
              </h2>
              <p className="text-center text-neutral-500 text-xs sm:text-sm mt-2">
                传承千年智慧，守护健康人生
              </p>
            </div>

            <div className="mb-6">
              <div className="flex rounded-lg bg-gray-100 p-1">
                {methods.map((method) => (
                  <button
                    key={method.key}
                    onClick={() => setLoginMethod(method.key)}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                      loginMethod === method.key
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <span className="text-xs">{method.icon}</span>
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 登录内容区域 */}
            <div className="flex-1 flex flex-col">
              {loginMethod === "qr" && (
                <QRLogin onSuccess={handleLoginSuccess} />
              )}

              {loginMethod === "code" && (
                <CodeLogin onSuccess={handleLoginSuccess} />
              )}

              {loginMethod === "email" && (
                <EmailLogin onSuccess={handleLoginSuccess} />
              )}

              {/* 社交登录 - 显示在所有登录方式下方 */}
              <SocialLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
