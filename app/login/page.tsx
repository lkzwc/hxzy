'use client'
import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react"
import { UserSwitchOutlined, QrcodeOutlined, GithubOutlined, CloseOutlined, GoogleOutlined} from '@ant-design/icons'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useSWR from 'swr';

function SocialLogin() {
  return (
    <div className="mt-4 flex justify-around space-x-4">
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-primary-50 transition-colors duration-200"
        title="使用 GitHub 登录"
        onClick={() => signIn('github')}
      >
        <GithubOutlined className=" text-primary" />
      </button>
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-primary-50 transition-colors duration-200"
        title="使用 Google 登录"
        onClick={() => signIn('google')}
      >
        <GoogleOutlined className=" text-primary" />
      </button>
    </div>
  );
}

const qrCodeFetcher = async (): Promise<any> => {
  const response = await fetch('/api/wechat', {
    method: 'POST'
  });
  return response.json();
};

const loginStatusFetcher = async (sceneStr: string): Promise<any> => {
  const response = await fetch('/api/wechat', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sceneStr }),
  });
  return response.json();
};

export default function Login() {
  const [isQRLogin, setIsQRLogin] = useState(true);
  const [loginType, setLoginType] = useState('sms');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // 获取二维码
  const { data: qrCode, error: qrError } = useSWR(
    isQRLogin ? 'qrCode' : null,
    qrCodeFetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  // 检查登录状态
  const { data: loginStatus, error: loginError } = useSWR(
    qrCode?.loginToken ? ['loginStatus', qrCode.loginToken] : null,
    () => loginStatusFetcher(qrCode.sceneStr),
    {
      refreshInterval: 2000, // 每2秒检查一次
      revalidateOnFocus: true,
    }
  );

  // 监听登录状态
  useEffect(() => {
    if (loginStatus?.status === 'authorized' && loginStatus?.openid) {
      signIn('credentials', {
        openid: loginStatus.openid,
        redirect: true,
      })
    }
  }, [loginStatus, router]);

  // 如果已登录，跳转到社区页面
  useEffect(() => {
    if (session) {
      router.push('/community');
    }
  }, [session, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('提交表单', { phone, code, loginType, isRegister });
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-[320px] sm:w-auto">
        <button
          onClick={handleClose}
          className="absolute -top-8 -right-8 p-2 rounded-full bg-white hover:bg-primary-50 transition-colors duration-200"
          title="关闭"
        >
          <CloseOutlined className="w-6 h-6 text-primary" />
        </button>

        <div className="bg-neutral-50 rounded-2xl flex overflow-hidden shadow-2xl w-full sm:w-[750px] h-[480px] relative">
          <button
            onClick={() => setIsQRLogin(!isQRLogin)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-primary-200 hover:bg-primary-50 transition-colors duration-200 text-primary"
            title={isQRLogin ? "账号登录" : "扫码登录"}
          >
            {isQRLogin ? (
              <UserSwitchOutlined className="w-4 h-4" />
            ) : (
              <QrcodeOutlined className="w-4 h-4" />
            )}
          </button>

          <div className="hidden sm:flex w-[280px] bg-gradient-to-b from-primary-600 to-primary-800 p-8 text-white flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute inset-0 bg-[url('/images/chinese-pattern.png')] bg-repeat opacity-20"></div>
            </div>
            <div className="relative z-10">
              <img 
                src="/images/traditional-chinese-medicine.png"
                alt="中医传承" 
                className="w-16 h-16 mb-8"
              />
              <h1 className="text-2xl font-bold mb-4">传承中医智慧</h1>
              <p className="text-gray-200 text-sm leading-relaxed">
                上医治未病<br/>
                中医治欲病<br/>
                下医治已病
              </p>
            </div>
          </div>

          <div className="flex-1 px-6 sm:px-12 py-6 sm:py-8 flex flex-col">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-center text-primary">欢迎来到中医传承平台</h2>
              <p className="text-center text-neutral-500 text-xs sm:text-sm mt-2">传承千年智慧，守护健康人生</p>
            </div>

            {isQRLogin ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center">
                  {qrCode?.qrCodeUrl ? (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Image 
                        src={qrCode.qrCodeUrl}
                        alt="微信登录二维码"
                        width={150}
                        height={150}
                        className="rounded-lg"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 bg-primary-50 rounded-lg flex items-center justify-center">
                      <QrcodeOutlined className="w-16 h-16 text-primary" />
                    </div>
                  )}
                  <p className="text-neutral-600 text-sm sm:text-base mb-2">请使用微信扫码登录</p>
                  <p className="text-neutral-400 text-xs">扫码后自动登录</p>
                </div>
                <div className="mt-auto">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-primary-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-4 text-primary bg-neutral-50">其他登录方式</span>
                    </div>
                  </div>
                  <SocialLogin />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex border-b border-primary-200 mb-6">
                  <button
                    onClick={() => setLoginType('sms')}
                    className={`flex-1 py-2 text-sm font-medium ${loginType === 'sms' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500'}`}
                  >
                    短信登录
                  </button>
                  <button
                    onClick={() => setLoginType('password')}
                    className={`flex-1 py-2 text-sm font-medium ${loginType === 'password' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500'}`}
                  >
                    密码登录
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="space-y-4">
                    <input
                      type="tel"
                      placeholder="请输入手机号"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 px-4 text-sm sm:text-base border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-neutral-50"
                    />

                    {loginType === 'sms' ? (
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="请输入验证码"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="flex-1 h-10 px-4 text-sm sm:text-base border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-neutral-50"
                        />
                        <button
                          type="button"
                          className="w-[96px] text-primary hover:text-primary-700 whitespace-nowrap text-sm font-medium"
                        >
                          发送验证码
                        </button>
                      </div>
                    ) : (
                      <input
                        type="password"
                        placeholder="请输入密码"
                        className="w-full h-10 px-4 text-sm sm:text-base border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-neutral-50"
                      />
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full h-10 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 text-sm sm:text-base font-medium"
                    >
                      {isRegister ? "注册" : "登录"}
                    </button>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-primary-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs sm:text-sm">
                        <span className="px-4 text-primary bg-neutral-50">其他登录方式</span>
                      </div>
                    </div>
                    <SocialLogin />
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}