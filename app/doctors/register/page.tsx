"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Alert,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ImageUpload from "@/components/PublishToolbar";

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", content: "" });
  const [form] = Form.useForm();

  const [avatarUrls, setAvatarUrls] = useState<string[]>([]);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // 处理表单提交
  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    setFormStatus({ type: "", content: "" });

    try {
      // 提交医生信息，包含附件URLs
      const doctorData = {
        ...values,
        avatar: avatarUrls[0] || "", // 头像URL
        attachmentUrls: attachmentUrls, // 附件URLs
      };

      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          type: "success",
          content: "提交成功！您的信息已经提交，我们会尽快审核。",
        });
        messageApi.success("提交成功！");
        // 重置表单
        form.resetFields();
        // 延迟跳转
        setTimeout(() => {
          router.push("/doctors");
        }, 2000);
      } else {
        setFormStatus({
          type: "error",
          content: data.error || "提交失败，请稍后再试。",
        });
        messageApi.error(data.error || "提交失败，请稍后再试。");
      }
    } catch (error) {
      console.error("提交出错:", error);
      setFormStatus({
        type: "error",
        content: "提交过程中出现错误，请稍后再试。",
      });
      messageApi.error("提交过程中出现错误，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    messageApi.error("表单验证失败，请检查输入内容");
    console.log("Failed:", errorInfo);
  };

  // 省份列表
  const provinces = [
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

  // 处理头像上传
  const handleAvatarChange = (urls: string[]) => {
    setAvatarUrls(urls);
  };

  // 处理附件上传
  const handleAttachmentChange = (urls: string[]) => {
    setAttachmentUrls(urls);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      {contextHolder}
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                名医入驻申请
              </h1>
              <p className="text-gray-600">
                加入华夏中医平台，与更多患者分享您的专业知识和经验
              </p>
            </div>
            <Link href="/doctors">
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                className="flex items-center gap-2"
              >
                返回名医列表
              </Button>
            </Link>
          </div>
        </div>

        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
          <div className="p-8">
            {formStatus.content && (
              <Alert
                message={formStatus.content}
                type={formStatus.type as "success" | "error" | "info" | "warning"}
                showIcon
                className="mb-8 rounded-lg"
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              requiredMark={false}
              className="space-y-6"
            >
            {/* 基本信息 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
                基本信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[{ required: true, message: "请输入姓名" }]}
                >
                  <Input
                    placeholder="请输入您的真实姓名"
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="联系电话"
                  name="phone"
                  rules={[
                    { required: true, message: "请输入联系电话" },
                    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码" },
                  ]}
                >
                  <Input
                    placeholder="请输入联系电话"
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>
              </div>
            </div>

            {/* 职业信息 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
                职业信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  label="所在医院"
                  name="hospital"
                  rules={[{ required: true, message: "请输入医院名称" }]}
                >
                  <Input
                    placeholder="请输入您所在的医院名称"
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="科室"
                  name="department"
                  rules={[{ required: true, message: "请输入科室" }]}
                >
                  <Input
                    placeholder="如：内科、外科、针灸科等"
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="专业专长"
                  name="specialty"
                  rules={[{ required: true, message: "请选择专长" }]}
                >
                  <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    placeholder="请选择您的专业专长（可多选）"
                    className="rounded-lg"
                    size="large"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      { value: "内科", label: "内科" },
                      { value: "外科", label: "外科" },
                      { value: "妇科", label: "妇科" },
                      { value: "儿科", label: "儿科" },
                      { value: "骨伤科", label: "骨伤科" },
                      { value: "针灸科", label: "针灸科" },
                      { value: "推拿科", label: "推拿科" },
                      { value: "肿瘤科", label: "肿瘤科" },
                      { value: "皮肤科", label: "皮肤科" },
                      { value: "男科", label: "男科" },
                      { value: "养生", label: "养生" },
                      { value: "康复", label: "康复" },
                      { value: "心理", label: "心理" },
                      { value: "眼科", label: "眼科" },
                      { value: "耳鼻喉科", label: "耳鼻喉科" },
                      { value: "肝病科", label: "肝病科" },
                      { value: "脾胃病科", label: "脾胃病科" },
                      { value: "肾病科", label: "肾病科" },
                      { value: "心脑血管科", label: "心脑血管科" },
                      { value: "糖尿病科", label: "糖尿病科" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="所在省份"
                  name="province"
                  rules={[{ required: true, message: "请选择所在省份" }]}
                >
                  <Select
                    placeholder="请选择您所在的省份"
                    className="rounded-lg"
                    size="large"
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province} value={province}>
                        {province}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* 个人信息 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
                个人信息
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 头像上传 */}
                <div className="lg:col-span-1">
                  <Form.Item label="个人头像" name="avatar">
                    <div className="flex flex-col items-center gap-4">
                      <ImageUpload
                        type="avatar"
                        value={avatarUrls}
                        onChange={handleAvatarChange}
                        maxCount={1}
                        className="w-32 h-32"
                      />
                      <p className="text-sm text-gray-500 text-center">
                        建议上传清晰的个人照片<br/>
                        支持 JPG、PNG 格式，大小不超过 5MB
                      </p>
                    </div>
                  </Form.Item>
                </div>

                {/* 个人简介 */}
                <div className="lg:col-span-2">
                  <Form.Item
                    label="个人简介"
                    name="introduction"
                    rules={[{ required: true, message: "请输入个人简介" }]}
                  >
                    <Input.TextArea
                      rows={8}
                      placeholder="请详细介绍您的专业背景、从医经历、擅长治疗的疾病、学术成就等信息，让患者更好地了解您的专业能力..."
                      className="rounded-lg"
                      showCount
                      maxLength={1000}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* 资质证明 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
                资质证明
              </h3>

              <Form.Item
                label="相关证书或资料"
                name="attachments"
              >
                <div className="flex flex-col gap-4">
                  <ImageUpload
                    type="post"
                    value={attachmentUrls}
                    onChange={handleAttachmentChange}
                    maxCount={6}
                    className="min-h-[120px]"
                  />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>建议上传以下资料：</strong>
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 医师资格证书</li>
                      <li>• 医师执业证书</li>
                      <li>• 学历证明或学位证书</li>
                      <li>• 职称证书</li>
                      <li>• 其他相关专业资质证明</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">
                      支持图片格式，最多上传6张，每张不超过5MB
                    </p>
                  </div>
                </div>
              </Form.Item>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-center pt-6">
              <Button
                htmlType="submit"
                loading={isSubmitting}
                size="large"
                className="px-12 py-3 h-auto text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-white border-primary hover:border-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? "提交中..." : "提交申请"}
              </Button>
            </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
