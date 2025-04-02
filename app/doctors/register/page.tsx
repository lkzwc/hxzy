'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    hospital: '',
    specialty: '',
    phone: '',
    province: '',
    introduction: '',
    avatar: ''
  });

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', content: '提交成功！您的信息已经提交，我们会尽快审核。' });
        // 重置表单
        setFormData({
          name: '',
          department: '',
          hospital: '',
          specialty: '',
          phone: '',
          province: '',
          introduction: '',
          avatar: ''
        });
        // 延迟跳转
        setTimeout(() => {
          router.push('/doctors');
        }, 2000);
      } else {
        setMessage({ type: 'error', content: data.error || '提交失败，请稍后再试。' });
      }
    } catch (error) {
      console.error('提交出错:', error);
      setMessage({ type: 'error', content: '提交过程中出现错误，请稍后再试。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 省份列表
  const provinces = [
    "北京", "天津", "河北", "山西", "内蒙古",
    "辽宁", "吉林", "黑龙江", "上海", "江苏",
    "浙江", "安徽", "福建", "江西", "山东",
    "河南", "湖北", "湖南", "广东", "广西",
    "海南", "重庆", "四川", "贵州", "云南",
    "西藏", "陕西", "甘肃", "青海", "宁夏",
    "新疆", "香港", "澳门"
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-800">名医入驻申请</h1>
          <Link href="/doctors" className="text-primary hover:underline">
            返回名医列表
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {message.content && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.content}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 姓名 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">姓名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 科室 */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-neutral-700 mb-1">科室 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 医院 */}
              <div>
                <label htmlFor="hospital" className="block text-sm font-medium text-neutral-700 mb-1">医院 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="hospital"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 专长 */}
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-neutral-700 mb-1">专长 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  placeholder="例如：内科、肿瘤科"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 联系电话 */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">联系电话 <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 所在省份 */}
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-neutral-700 mb-1">所在省份 <span className="text-red-500">*</span></label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">请选择省份</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* 头像URL */}
              <div className="md:col-span-2">
                <label htmlFor="avatar" className="block text-sm font-medium text-neutral-700 mb-1">头像URL</label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="请输入头像图片链接"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 个人简介 */}
              <div className="md:col-span-2">
                <label htmlFor="introduction" className="block text-sm font-medium text-neutral-700 mb-1">个人简介 <span className="text-red-500">*</span></label>
                <textarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-md text-white font-medium ${isSubmitting ? 'bg-neutral-400' : 'bg-primary hover:bg-primary-dark'} transition-colors`}
              >
                {isSubmitting ? '提交中...' : '提交申请'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}