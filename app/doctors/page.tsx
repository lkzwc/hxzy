'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

// 定义医生数据类型
interface Doctor {
  id: number;
  name: string;
  department?: string;
  hospital: string;
  specialty: string | string[];
  phone?: string;
  province: string;
  introduction?: string;
  description?: string;
  avatar?: string;
  title?: string;
  ability?: string;
  region?: string;
  createdAt?: string;
  updatedAt?: string;
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
const specialties = ['全部','全科', '内科', '外科', '妇科', '儿科', '肿瘤科', '骨科', '针灸科'];

export default function DoctorsPage() {
  const [selectedRegion, setSelectedRegion] = useState('全部');
  const [selectedSpecialty, setSelectedSpecialty] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<any>([]);

  // 定义获取医生数据的函数
  const fetchDoctors = async () => {
    try {
      // 构建带有筛选参数的URL
      let url = '/api/doctors';
      const params = new URLSearchParams();
      
      if (selectedRegion !== '全部') {
        params.append('province', selectedRegion);
      }
      
      if (selectedSpecialty !== '全部') {
        params.append('specialty', selectedSpecialty);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      // 如果有参数，添加到URL
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const {data} = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 当筛选条件变化时获取数据
  useEffect(() => {
    fetchDoctors();
  }, [selectedRegion, selectedSpecialty]);

  // 筛选医生 - 只根据搜索关键词筛选，地区和专科筛选已经在API请求中处理
  const filteredDoctors = doctors.filter((doctor: Doctor) => {
    if (!searchQuery) return true;
    
    return doctor.name?.includes(searchQuery) || 
           doctor.hospital?.includes(searchQuery) ||
           doctor.description?.includes(searchQuery) ||
           doctor.province?.includes(searchQuery);
  });

  return (
    <div className="min-h-screen bg-neutral-50 relative p-8">
      {/* 筛选区域 */}
      <div className="max-w-7xl mx-auto p-4">
        {/* 顶部搜索区域 */}
        <div className="bg-white rounded-lg shadow-md p-2 space-y-6">
          {/* 搜索框 */}
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="搜索疾病名称、专科、医生名称、医院名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                onClick={() => fetchDoctors()} 
                className="bg-primary py-[1px] px-10 text-white rounded-r-md hover:bg-primary-dark transition-colors"
              >
                🔍 搜索
              </button>
            </div>
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor: Doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 rounded-full bg-neutral-100 flex-shrink-0">
                      {doctor.avatar && (
                        <img 
                          src={doctor.avatar} 
                          alt={doctor.name} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-800">{doctor.name}</h3>
                      <p className="text-primary-600">{doctor.ability || doctor.title}</p>
                      <p className="text-neutral-600">{doctor.province}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {doctor.specialty && (typeof doctor.specialty === 'string' ? 
                          <span className="px-2 py-1 bg-primary-50 rounded-full text-xs text-primary-600">
                            {doctor.specialty}
                          </span>
                          : 
                          Array.isArray(doctor.specialty) && doctor.specialty.map((spec) => (
                            <span key={spec} className="px-2 py-1 bg-primary-50 rounded-full text-xs text-primary-600">
                              {spec}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-neutral-600 line-clamp-3">{doctor.description || doctor.introduction}</p>
                  <Link 
                    href={`/doctors/${doctor.id}`}
                    className="mt-4 block w-full py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors text-center"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-neutral-500">没有找到符合条件的医生</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 右下角固定的名医入驻按钮 */}
      <div className="fixed bottom-8 right-8 z-10">
        <Link href="/doctors/register" className="px-4 py-3 bg-primary text-white rounded-md shadow-lg hover:bg-primary-dark transition-colors flex items-center">
          <span>名医入驻</span>
        </Link>
      </div>
    </div>
  );
}