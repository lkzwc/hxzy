'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Select, Card, Alert, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', content: '' });
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  // 处理表单提交
  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    setFormStatus({ type: '', content: '' });

    try {
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({ type: 'success', content: '提交成功！您的信息已经提交，我们会尽快审核。' });
        messageApi.success('提交成功！');
        // 重置表单
        form.resetFields();
        // 延迟跳转
        setTimeout(() => {
          router.push('/doctors');
        }, 2000);
      } else {
        setFormStatus({ type: 'error', content: data.error || '提交失败，请稍后再试。' });
        messageApi.error(data.error || '提交失败，请稍后再试。');
      }
    } catch (error) {
      console.error('提交出错:', error);
      setFormStatus({ type: 'error', content: '提交过程中出现错误，请稍后再试。' });
      messageApi.error('提交过程中出现错误，请稍后再试。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onFinishFailed = (errorInfo: any) => {
    messageApi.error('表单验证失败，请检查输入内容');
    console.log('Failed:', errorInfo);
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
      {contextHolder}
      <div className="max-w-3xl mx-auto px-4">
        <Card
          title={
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-neutral-800">名医入驻申请</h1>
              <Link href="/doctors">
                <Button type="link" icon={<ArrowLeftOutlined />}>返回名医列表</Button>
              </Link>
            </div>
          }
          className="shadow-md"
        >
          {formStatus.content && (
            <Alert
              message={formStatus.content}
              type={formStatus.type as 'success' | 'error' | 'info' | 'warning'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 姓名 */}
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>

              {/* 科室 */}
              <Form.Item
                label="科室"
                name="department"
                rules={[{ required: true, message: '请输入科室' }]}
              >
                <Input placeholder="请输入科室" />
              </Form.Item>

              {/* 医院 */}
              <Form.Item
                label="医院"
                name="hospital"
                rules={[{ required: true, message: '请输入医院名称' }]}
              >
                <Input placeholder="请输入医院名称" />
              </Form.Item>

              {/* 专长 */}
              <Form.Item
                label="专长"
                name="specialty"
                rules={[{ required: true, message: '请选择专长' }]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  placeholder="请选择专长"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: '中医内科', label: '中医内科' },
                    { value: '中医外科', label: '中医外科' },
                    { value: '中医妇科', label: '中医妇科' },
                    { value: '中医儿科', label: '中医儿科' },
                    { value: '中医骨伤科', label: '中医骨伤科' },
                    { value: '针灸科', label: '针灸科' },
                    { value: '推拿科', label: '推拿科' },
                    { value: '中医肿瘤科', label: '中医肿瘤科' },
                    { value: '中医皮肤科', label: '中医皮肤科' },
                    { value: '中医男科', label: '中医男科' },
                    { value: '中医养生', label: '中医养生' },
                    { value: '中医康复', label: '中医康复' },
                    { value: '中医心理', label: '中医心理' },
                    { value: '中医眼科', label: '中医眼科' },
                    { value: '中医耳鼻喉科', label: '中医耳鼻喉科' },
                    { value: '中医肝病科', label: '中医肝病科' },
                    { value: '中医脾胃病科', label: '中医脾胃病科' },
                    { value: '中医肾病科', label: '中医肾病科' },
                    { value: '中医心脑血管科', label: '中医心脑血管科' },
                    { value: '中医糖尿病科', label: '中医糖尿病科' }
                  ]}
                />
              </Form.Item>

              {/* 联系电话 */}
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>

              {/* 所在省份 */}
              <Form.Item
                label="所在省份"
                name="province"
                rules={[{ required: true, message: '请选择所在省份' }]}
              >
                <Select placeholder="请选择省份">
                  {provinces.map(province => (
                    <Select.Option key={province} value={province}>{province}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* 头像URL */}
            <Form.Item
              label="头像URL"
              name="avatar"
            >
              <Input placeholder="请输入头像图片链接" />
            </Form.Item>

            {/* 个人简介 */}
            <Form.Item
              label="个人简介"
              name="introduction"
              rules={[{ required: true, message: '请输入个人简介' }]}
            >
              <Input.TextArea 
                rows={5} 
                placeholder="请简要介绍您的专业背景、从医经历和擅长治疗的疾病等"
              />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                color="default" 
                variant='solid'
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