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
  Upload,
  message,
  App
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", content: "" });
  const [form] = Form.useForm();

  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // 处理表单提交
  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    setFormStatus({ type: "", content: "" });

    try {
      // 提交医生信息，包含附件URLs
      const doctorData = {
        ...values,
        attachmentUrls: attachments.map(file => file.response?.urls?.[0]).filter(Boolean),
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

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      messageApi.error('只能上传JPG/PNG格式的图片！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error('图片大小不能超过2MB！');
      return false;
    }
    return true; // 返回true允许自动上传
  };

  // 处理头像上传
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done') {
      // 上传成功，设置头像URL
      if (info.file.response && info.file.response.urls && info.file.response.urls.length > 0) {
        setAvatarUrl(info.file.response.urls[0]);
      }
    } else if (info.file.status === 'error') {
      messageApi.error('头像上传失败');
    }
  };

  // 处理附件上传
  const handleAttachmentChange = ({ fileList }: any) => {
    setAttachments(fileList);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      {contextHolder}
      <div className="max-w-3xl mx-auto px-4">
        <Card
          title={
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-neutral-800">
                名医入驻申请
              </h1>
              <Link href="/doctors">
                <Button type="link" icon={<ArrowLeftOutlined />}>
                  返回名医列表
                </Button>
              </Link>
            </div>
          }
          className="shadow-md"
        >
          {formStatus.content && (
            <Alert
              message={formStatus.content}
              type={formStatus.type as "success" | "error" | "info" | "warning"}
              showIcon
              className="mb-6"
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
              {/* 姓名 */}
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: "请输入姓名" }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>

              {/* 科室 */}
              <Form.Item
                label="科室"
                name="department"
                rules={[{ required: true, message: "请输入科室" }]}
              >
                <Input placeholder="请输入科室" />
              </Form.Item>

              {/* 医院 */}
              <Form.Item
                label="医院"
                name="hospital"
                rules={[{ required: true, message: "请输入医院名称" }]}
              >
                <Input placeholder="请输入医院名称" />
              </Form.Item>

              {/* 专长 */}
              <Form.Item
                label="专长"
                name="specialty"
                rules={[{ required: true, message: "请选择专长" }]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  placeholder="请选择专长"
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

              {/* 联系电话 */}
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[
                  { required: true, message: "请输入联系电话" },
                  { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码" },
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>

              {/* 所在省份 */}
              <Form.Item
                label="所在省份"
                name="province"
                rules={[{ required: true, message: "请选择所在省份" }]}
              >
                <Select placeholder="请选择省份">
                  {provinces.map((province) => (
                    <Select.Option key={province} value={province}>
                      {province}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* 头像URL */}
            <Form.Item label="上传头像" name="avatar">
              <Upload
                name="files"
                action="/api/upload"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleAvatarChange}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="头像" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <button style={{ border: 0, background: "none" }} type="button">
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传头像</div>
                  </button>
                )}
              </Upload>
            </Form.Item>

            {/* 个人简介 */}
            <Form.Item
              label="个人简介"
              name="introduction"
              rules={[{ required: true, message: "请输入个人简介" }]}
            >
              <Input.TextArea
                rows={5}
                placeholder="请简要介绍您的专业背景、从医经历和擅长治疗的疾病等"
              />
            </Form.Item>

            <Form.Item
              label="上传其他附件"
              name="attachments"
            >
              <Upload
                name="files"
                action="/api/upload"
                listType="picture-card"
                fileList={attachments}
                beforeUpload={beforeUpload}
                onChange={handleAttachmentChange}
              >
                {attachments.length < 5 && (
                  <button style={{ border: 0, background: "none" }} type="button">
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传附件</div>
                  </button>
                )}
              </Upload>
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                color="default"
                variant="solid"
                htmlType="submit"
                loading={isSubmitting}
                size="large"
              >
                提交申请
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
