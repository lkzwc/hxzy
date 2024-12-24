'use client'
import { useState } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'wechat' | 'github'>('phone');
  // 添加表单状态
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  // 验证手机号格式
  const isValidPhone = (phone: string) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  // 获取验证码
  const handleGetCode = async () => {
    if (!isValidPhone(phone)) {
      alert('请输入正确的手机号');
      return;
    }
    
    try {
      setLoading(true);
      // 调用后端API发送验证码
      const response = await fetch('/api/sendCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error('发送验证码失败');
      }

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      alert('发送验证码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 提交登录
  const handleLogin = async () => {
    if (!isValidPhone(phone)) {
      alert('请输入正确的手机号');
      return;
    }
    if (!code) {
      alert('请输入验证码');
      return;
    }

    try {
      setLoading(true);
      // 调用后端API验证登录
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code }),
      });

      if (!response.ok) {
        throw new Error('登录失败');
      }

      const data = await response.json();
      // 登录成功，存储token
      localStorage.setItem('token', data.token);
      // 跳转到首页
      window.location.href = '/';

    } catch (error) {
      alert('登录失败，请检查验证码是否正确');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* 标题 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">登录中医文化传承</h2>
          <p className="mt-2 text-text/60">传承国粹，弘扬中医文化</p>
        </div>

        {/* 登录方式切换 */}
        <div className="flex justify-center space-x-4 border-b border-gray-200">
          <button
            onClick={() => setLoginMethod('phone')}
            className={`pb-2 px-4 ${loginMethod === 'phone' ? 'border-b-2 border-secondary text-primary' : 'text-gray-500'}`}
          >
            手机号登录
          </button>
          <button
            onClick={() => setLoginMethod('wechat')}
            className={`pb-2 px-4 ${loginMethod === 'wechat' ? 'border-b-2 border-secondary text-primary' : 'text-gray-500'}`}
          >
            微信登录
          </button>
          <button
            onClick={() => setLoginMethod('github')}
            className={`pb-2 px-4 ${loginMethod === 'github' ? 'border-b-2 border-secondary text-primary' : 'text-gray-500'}`}
          >
            GitHub登录
          </button>
        </div>

        {/* 手机号登录表单 */}
        {loginMethod === 'phone' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text">
                手机号
              </label>
              <div className="mt-1 relative">
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                  placeholder="请输入手机号"
                />
              </div>
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-text">
                验证码
              </label>
              <div className="mt-1 flex gap-3">
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-[60%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                  placeholder="请输入验证码"
                />
                <button 
                  onClick={handleGetCode}
                  disabled={countdown > 0 || loading}
                  className={`w-[40%] px-4 py-2 text-white rounded-md whitespace-nowrap text-sm
                    ${countdown > 0 ? 'bg-gray-400' : 'bg-secondary hover:bg-secondary/90'} 
                    transition-colors`}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                </button>
              </div>
            </div>
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {loading ? '登录中...' : '登录/注册'}
            </button>
          </div>
        )}

        {/* 微信扫码登录 */}
        {loginMethod === 'wechat' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* 替换为实际的微信二维码 */}
              <p className="text-gray-500">微信二维码</p>
            </div>
            <p className="text-sm text-text/60">请使用微信扫描二维码登录</p>
          </div>
        )}

        {/* GitHub登录 */}
        {loginMethod === 'github' && (
          <div className="flex flex-col items-center space-y-4">
            <button onClick={() => signIn()} className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>使用 GitHub 登录</span>
            </button>
            <p className="text-sm text-text/60">点击按钮跳转至 GitHub 授权</p>
          </div>
        )}

        {/* 底部协议 */}
        <div className="text-center text-sm text-text/60">
          登录即表示同意
          <a href="#" className="text-secondary hover:text-secondary/80">《用户协议》</a>
          和
          <a href="#" className="text-secondary hover:text-secondary/80">《隐私政策》</a>
        </div>
      </div>
    </div>
  );
}