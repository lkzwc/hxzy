"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Input, Card, Pagination, Empty, Spin, Tag } from "antd";
import {
  PlusCircleOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// 定义医生数据类型
interface Doctor {
  id: number;
  name: string;
  department?: string;
  hospital: string;
  specialty: string;
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

// 地区数据
const regions = [
  "北京",
  "天津",
  "河北",
  "山西",
  "内蒙古",
  "辽宁",
  "吉林",
  "黑龙江",
  "上海",
  "江苏",
  "浙江",
  "安徽",
  "福建",
  "江西",
  "山东",
  "河南",
  "湖北",
  "湖南",
  "广东",
  "广西",
  "海南",
  "重庆",
  "四川",
  "贵州",
  "云南",
  "西藏",
  "陕西",
  "甘肃",
  "青海",
  "宁夏",
  "新疆",
  "香港",
  "澳门",
];
// 专科数据
const specialties = [
  "全部",
  "全科",
  "内科",
  "外科",
  "妇科",
  "儿科",
  "肿瘤科",
  "骨科",
  "针灸科",
];

export default function DoctorsPage() {
  const [selectedRegion, setSelectedRegion] = useState("全部");
  const [selectedSpecialty, setSelectedSpecialty] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  // 定义获取医生数据的函数
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // 构建带有筛选参数的URL
      let url = "/api/doctors";
      const params = new URLSearchParams();

      if (selectedRegion !== "全部") {
        params.append("province", selectedRegion);
      }

      if (selectedSpecialty !== "全部") {
        params.append("specialty", selectedSpecialty);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      // 添加分页参数
      params.append("page", currentPage.toString());
      params.append("pageSize", pageSize.toString());

      // 如果有参数，添加到URL
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data, total: totalCount } = await response.json();
      setDoctors(data);
      setTotal(totalCount || data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 当筛选条件或分页变化时获取数据
  useEffect(() => {
    fetchDoctors();
  }, [selectedRegion, selectedSpecialty, currentPage, pageSize]);

  // 筛选医生 - 只根据搜索关键词筛选，地区和专科筛选已经在API请求中处理
  const filteredDoctors = doctors.filter((doctor: Doctor) => {
    if (!searchQuery) return true;

    return (
      doctor.name?.includes(searchQuery) ||
      doctor.hospital?.includes(searchQuery) ||
      doctor.description?.includes(searchQuery) ||
      doctor.province?.includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-neutral-50 relative md:p-8">
      {/* 筛选区域 */}
      <div className="max-w-7xl mx-auto p-4">
        {/* 顶部搜索区域 */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 border border-primary-100">
          {/* 搜索框 */}
          <div className="relative">
            <div className="flex items-center">
              <Input.Search
                placeholder="搜索疾病名称、专科、医生名称、医院名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={() => fetchDoctors()}
                enterButton={
                  <Button
                    className="!bg-primary-600 !text-white !border-primary-600 hover:!bg-primary-700 hover:!border-primary-700 rounded-full"
                    icon={<SearchOutlined />}
                  >
                    搜索
                  </Button>
                }
                size="large"
                className="w-full [&_.ant-input]:!border-primary-300 [&_.ant-input]:focus:!border-primary-600 [&_.ant-input]:hover:!border-primary-400 [&_.ant-input-group-addon]:!border-primary-600 [&_.ant-input-group-addon]:!bg-primary-600"
              />
            </div>
          </div>

          {/* 筛选条件 */}
          <div className="space-y-4">
            {/* 地区筛选 */}
            <div>
              <h3 className="text-neutral-800 font-medium mb-2">
                按地区筛选：
              </h3>
              <div className="flex flex-wrap gap-2">
                <Tag.CheckableTag
                  checked={selectedRegion === "全部"}
                  onChange={() => setSelectedRegion("全部")}
                  className={`px-4 py-1 rounded-full text-sm transition-all duration-300 ${
                    selectedRegion === "全部"
                      ? "!bg-gradient-to-r !from-primary-500 !to-primary-600 !text-white shadow-sm"
                      : "hover:bg-primary-50"
                  }`}
                >
                  全部
                </Tag.CheckableTag>
                {regions.map((region) => (
                  <Tag.CheckableTag
                    key={region}
                    checked={selectedRegion === region}
                    onChange={() => setSelectedRegion(region)}
                    className={`px-4 py-1 rounded-full text-sm transition-all duration-300 ${
                      selectedRegion === region
                        ? "!bg-gradient-to-r !from-primary-500 !to-primary-600 !text-white shadow-sm"
                        : "hover:bg-primary-50"
                    }`}
                  >
                    {region}
                  </Tag.CheckableTag>
                ))}
              </div>
            </div>

            {/* 专科筛选 */}
            <div>
              <h3 className="text-neutral-800 font-medium mb-2">
                按专科筛选：
              </h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <Tag.CheckableTag
                    key={specialty}
                    checked={selectedSpecialty === specialty}
                    onChange={() => setSelectedSpecialty(specialty)}
                    className={`px-4 py-1 rounded-full text-sm transition-all duration-300 ${
                      selectedSpecialty === specialty
                        ? "!bg-gradient-to-r !from-primary-500 !to-primary-600 !text-white shadow-sm"
                        : "hover:bg-primary-50"
                    }`}
                  >
                    {specialty}
                  </Tag.CheckableTag>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 医生列表 */}
        <Spin spinning={loading} tip="加载中..." className="[&_.ant-spin-dot-item]:!bg-primary-600 !text-primary-600">
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor: Doctor) => (
                <Card
                  key={doctor.id}
                  hoverable
                  className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-b from-white to-primary-50"
                  actions={[
                    <Link
                      key="view"
                      href={`/doctors/${doctor.id}`}
                      className="px-3 pb-2"
                    >
                      <Button
                        color="orange"
                        variant="outlined"
                        block
                        className="rounded-full shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-primary-500 to-primary-600 border-0 h-8 text-sm"
                      >
                        查看详情
                      </Button>
                    </Link>,
                  ]}
                >
                  <div className="flex p-3">
                    {/* 左侧头像 */}
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-white p-1 shadow-sm border border-primary-100">
                        {doctor.avatar ? (
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-200 to-accent-200 flex items-center justify-center text-lg font-bold text-white">
                            {doctor.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 右侧内容 */}
                    <div className="flex-1">
                      <div className="mb-1">
                        <h3 className="text-lg font-bold text-gray-800">
                          {doctor.name}
                        </h3>
                        <p className="text-primary-600 font-medium text-sm">
                          {doctor.ability || doctor.title}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-xs flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {doctor.province || doctor.hospital}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {doctor.specialty
                            ?.split(",")
                            .map((item: string, index: number) => (
                              <Tag
                                key={index}
                                className="rounded-sm text-primary-600 border-secondary-500"
                              >
                                {item}
                              </Tag>
                            ))}
                        </div>

                        <div className="mt-2 text-gray-600 line-clamp-2 text-xs bg-white bg-opacity-70 p-1 rounded-lg">
                          {doctor.description || doctor.introduction}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Empty description="没有找到符合条件的医生" />
              </div>
            )}
          </div>

          {/* 分页 */}
          {filteredDoctors.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                }}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条记录`}
              />
            </div>
          )}
        </Spin>
      </div>

      {/* 右下角固定的名医入驻按钮 */}
      <div className="fixed bottom-8 right-8 z-10">
        <Link href="/doctors/register">
          <Button
            size="large"
            icon={<PlusCircleOutlined />}
            className="!text-white !bg-gradient-to-r !from-primary-500 !to-primary-600 !border-0 rounded-full h-12 px-6 hover:shadow-xl transition-all duration-300 hover:!from-primary-600 hover:!to-primary-700"
          >
            名医入驻
          </Button>
        </Link>
      </div>
    </div>
  );
}
