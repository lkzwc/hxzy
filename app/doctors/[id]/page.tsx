'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


// 示例详细数据
const doctorDetailData = {
  id: 1,
  name: '张三丰',
  title: '主任医师',
  hospital: '北京中医医院',
  region: '北京',
  specialty: ['内科', '肿瘤科'],
  avatar: '/doctors/doctor1.jpg',
  description: '从医40余年，擅长治疗各种疑难杂症，尤其在肿瘤、心脑血管疾病等方面有独特见解。',
  education: [
    '北京中医药大学博士',
    '中国中医科学院博士后'
  ],
  experience: [
    '1985-1990 北京中医医院住院医师',
    '1990-2000 北京中医医院主治医师',
    '2000-至今 北京中医医院主任医师'
  ],
  achievements: [
    '国家级名中医',
    '全国优秀中医临床人才',
    '发表学术论文100余篇',
    '主持国家级科研项目5项'
  ],
  outpatientTime: [
    '周一上午 8:00-12:00',
    '周三下午 14:00-17:00',
    '周五全天 8:00-17:00'
  ],
  treatableDiseases: [
    '肿瘤相关疾病',
    '心脑血管疾病',
    '消化系统疾病',
    '呼吸系统疾病',
    '免疫系统疾病'
  ]
};

export default function DoctorDetailPage({ params }: any) {
  // 使用React.use()解包params
  const resolvedParams: any = React.use(params);
  const doctorId = resolvedParams.id;
  
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    // 这里应该是从API获取数据
    // 暂时使用示例数据
    setDoctor(doctorDetailData);
  }, [doctorId]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 返回按钮 */}
      <div className="bg-primary text-background">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/doctors" className="inline-flex items-center text-background/90 hover:text-background">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回医生列表
          </Link>
        </div>
      </div>

      {/* 医生基本信息 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start gap-8">
            <div className="w-48 h-48 rounded-lg bg-gray-200 flex-shrink-0">
              {/* 医生头像 */}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-primary">{doctor.name}</h1>
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                  {doctor.title}
                </span>
              </div>
              <p className="mt-2 text-lg text-gray-600">{doctor.hospital}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {doctor.specialty.map((spec: any) => (
                  <span key={spec} className="px-3 py-1 bg-background rounded-full text-text">
                    {spec}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-gray-600">{doctor.description}</p>
            </div>
          </div>
        </div>

        {/* 详细信息 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧信息 */}
          <div className="space-y-8">
            {/* 教育背景 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2">教育背景</h2>
              <ul className="mt-4 space-y-2">
                {doctor.education.map((edu: any, index: any) => (
                  <li key={index} className="text-gray-600">{edu}</li>
                ))}
              </ul>
            </div>

            {/* 工作经历 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2">工作经历</h2>
              <ul className="mt-4 space-y-2">
                {doctor.experience.map((exp: any, index: any) => (
                  <li key={index} className="text-gray-600">{exp}</li>
                ))}
              </ul>
            </div>

            {/* 学术成就 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2">学术成就</h2>
              <ul className="mt-4 space-y-2">
                {doctor.achievements.map((ach: any, index: any) => (
                  <li key={index} className="text-gray-600">{ach}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右侧信息 */}
          <div className="space-y-8">
            {/* 出诊时间 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2">出诊时间</h2>
              <ul className="mt-4 space-y-2">
                {doctor.outpatientTime.map((time: any, index: any) => (
                  <li key={index} className="text-gray-600">{time}</li>
                ))}
              </ul>
            </div>

            {/* 擅长疾病 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-primary border-b border-gray-200 pb-2">擅长疾病</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {doctor.treatableDiseases.map((disease: any, index: any) => (
                  <span key={index} className="px-3 py-1 bg-background rounded-full text-text text-sm">
                    {disease}
                  </span>
                ))}
              </div>
            </div>

            {/* 预约按钮 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                预约问诊
              </button>
              <p className="mt-4 text-sm text-gray-500 text-center">
                提示：预约成功后请按时就诊，如需取消请提前告知
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}