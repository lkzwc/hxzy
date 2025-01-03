'use client'
import { useState } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react"
import { User, TwoDimensionalCodeOne } from '@icon-park/react'


function SocialLogin() {
  return (
    <div className="mt-6 flex justify-center space-x-4">
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
        title="使用 GitHub 登录"
      >
        <img 
          src="https://img.alicdn.com/imgextra/i3/O1CN01KPSDJmY1h91/third-party-github.png"
          alt="GitHub"
          className="w-5 h-5"
        />
      </button>
    </div>
  );
}
export default function Login() {
  const [isQRLogin, setIsQRLogin] = useState(false);
  const [loginType, setLoginType] = useState('sms');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交表单', { phone, code, loginType, isRegister });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      <div className="relative">
        <div className="bg-white rounded-2xl flex overflow-hidden animate-slide-up w-[680px] h-[400px]">
          <div className="w-[280px] bg-[#20293c] p-8 text-white flex flex-col justify-center">
            <img 
              src="https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-82.svg" 
              alt="Logo" 
              className="w-12 h-12 mb-6"
            />
            <h1 className="text-2xl font-bold mb-4">把产品设计得更美好</h1>
            <p className="text-gray-300 text-sm">
              AI设计搜索·团队协同·UI/UX设计·原型设计·设计交付
            </p>
          </div>

          <div className="flex-1 px-8 py-6 relative">
            <div className="absolute right-4 top-2">
              {isQRLogin ? (
                <button
                  onClick={() => setIsQRLogin(false)}
                  className="flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-600"
                >
                  <User theme="outline" size="16" fill="#4a90e2"/>
                  账号登录
                </button>
              ) : (
                <button
                  onClick={() => setIsQRLogin(true)}
                  className="flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-600"
                >
                  <TwoDimensionalCodeOne theme="outline" size="16" fill="#4a90e2"/>
                  扫码登录
                </button>
              )}
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-center">欢迎使用</h2>
            </div>

            {isQRLogin ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-32 h-32 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <TwoDimensionalCodeOne className="w-14 h-14 text-gray-400" />
                </div>
                <p className="text-gray-600">请使用 App 扫码登录</p>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex border-b mb-4">
                  <button
                    onClick={() => setLoginType('sms')}
                    className={`flex-1 py-2 text-sm font-medium ${loginType === 'sms' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  >
                    短信登录
                  </button>
                  <button
                    onClick={() => setLoginType('password')}
                    className={`flex-1 py-2 text-sm font-medium ${loginType === 'password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  >
                    密码登录
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-[-10px]">
                  <div className="space-y-1">
                    <input
                      type="tel"
                      placeholder="请输入手机号"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-9 px-3 my-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
          
                    {loginType === 'sms' ? (
                      <div className="flex gap-2 mt-4 ">
                        <input
                          type="text"
                          placeholder="请输入验证码"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="flex-1 h-9 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="px-3 text-blue-600 hover:text-blue-700 whitespace-nowrap text-sm"
                        >
                          发送验证码
                        </button>
                      </div>
                    ) : (
                      <div className='mt-4'>
                        <input
                        type="password"
                        placeholder="请输入密码"
                        className="w-full h-9 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                      {isRegister ? "注册" : "登录"}
                    </button>

                    <div className="mt-3 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 text-gray-400 bg-white">其他登录方式</span>
                        </div>
                      </div>
                      <SocialLogin />
                    </div>
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