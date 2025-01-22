'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

// 定义医生数据类型
interface Doctor {
  province: string;
  ability: string;
  id: number;
  name: string;
  title: string;
  hospital: string;
  region: string;
  specialty: string[];
  avatar: string;
  description: string;
}

// 示例数据
const doctorsData: Doctor[] = [
  {
    id: 1,
    name: '张三丰',
    title: '主任医师',
    hospital: '北京中医医院',
    region: '北京',
    specialty: ['内科', '肿瘤科'],
    avatar: '/doctors/doctor1.jpg',
    description: '从医40余年，擅长治疗各种疑难杂症大撒的撒的撒的撒的撒的撒打算.dd..',
    province: '',
    ability: ''
  },
  // 添加更多医生数据...
];

// 地区数据
const regions = [
  "北京", "天津", "河北", "山西", "内蒙古",
  "辽宁", "吉林", "黑龙江", "上海", "江苏",
  "浙江", "安徽", "福建", "江西", "山东",
  "河南", "湖北", "湖南", "广东", "广西",
  "海南", "重庆", "四川", "贵州", "云南",
  "西藏", "陕西", "甘肃", "青海", "宁夏",
  "新疆", "香港", "澳门"
];
// 专科数据
const specialties = ['全部', '内科', '外科', '妇科', '儿科', '肿瘤科', '骨科', '针灸科'];

export default function DoctorsPage() {
  const [selectedRegion, setSelectedRegion] = useState('全部');
  const [selectedSpecialty, setSelectedSpecialty] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<any>([]);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const {data} = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      } finally {
      }
    }

    fetchDoctors();
  }, []);

  // 筛选医生
  const filteredDoctors = doctorsData.filter(doctor => {
    const matchRegion = selectedRegion === '全部' || doctor.region === selectedRegion;
    const matchSpecialty = selectedSpecialty === '全部' || doctor.specialty.includes(selectedSpecialty);
    const matchSearch = doctor.name.includes(searchQuery) || 
                       doctor.hospital.includes(searchQuery) ||
                       doctor.description.includes(searchQuery);
    return matchRegion && matchSpecialty && matchSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 筛选区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* 搜索框 */}
          <div className="relative">
            <input
              type="text"
              placeholder="搜索医生姓名、医院或专长..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 筛选条件 */}
          <div className="space-y-4">
            {/* 地区筛选 */}
            <div>
              <h3 className="text-neutral-800 font-medium mb-2">按地区筛选：</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRegion('全部')}
                  className={`px-4 py-1 rounded-full text-sm transition-colors
                    ${selectedRegion === '全部'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                >
                  全部
                </button>
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-1 rounded-full text-sm transition-colors
                      ${selectedRegion === region
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* 专科筛选 */}
            <div>
              <h3 className="text-neutral-800 font-medium mb-2">按专科筛选：</h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`px-4 py-1 rounded-full text-sm transition-colors
                      ${selectedSpecialty === specialty
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 医生列表 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor: Doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 rounded-full bg-neutral-100 flex-shrink-0">
                    {/* 这里可以添加医生头像 */}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-800">{doctor.name}</h3>
                    <p className="text-primary-600">{doctor.ability}</p>
                    <p className="text-neutral-600">{doctor.province}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctor.specialty?.map((spec) => (
                        <span key={spec} className="px-2 py-1 bg-primary-50 rounded-full text-xs text-primary-600">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-neutral-600 line-clamp-3">{doctor.description}</p>
                <Link 
                  href={`/doctors/${doctor.id}`}
                  className="mt-4 block w-full py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors text-center"
                >
                  查看详情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 