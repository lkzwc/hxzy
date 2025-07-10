# 图片上传组件使用指南

## 📸 概述

`ImageUpload` 是一个通用的图片上传组件，支持多种使用场景，包括发帖、评论、头像上传和附件上传。组件支持本地存储和 Cloudflare R2 云存储。

## 🚀 快速开始

### 基本使用

```tsx
import ImageUpload from '@/components/ImageUpload';

function MyComponent() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <ImageUpload
      type="post"
      value={images}
      onChange={setImages}
      maxCount={6}
    />
  );
}
```

## 📋 API 参考

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'post' \| 'comment' \| 'avatar' \| 'attachment'` | - | 上传场景类型 |
| `value` | `string[]` | `[]` | 当前图片URL列表 |
| `onChange` | `(urls: string[]) => void` | - | 图片变化回调 |
| `maxCount` | `number` | 根据type自动设置 | 最大上传数量 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `className` | `string` | `''` | 自定义样式类名 |
| `uploadText` | `string` | 根据type自动设置 | 上传提示文字 |
| `showPreview` | `boolean` | `true` | 是否显示预览 |
| `dragger` | `boolean` | `false` | 是否支持拖拽上传 |

### 场景配置

| 场景 | 最大数量 | 默认提示 | 特点 |
|------|----------|----------|------|
| `post` | 6 | "上传图片" | 支持多选，网格布局 |
| `comment` | 1 | "添加图片" | 单选，紧凑布局 |
| `avatar` | 1 | "上传头像" | 单选，1:1比例 |
| `attachment` | 5 | "上传附件" | 多选，列表布局 |

## 🎯 使用场景

### 1. 发帖场景

```tsx
<ImageUpload
  type="post"
  value={postImages}
  onChange={setPostImages}
  maxCount={6}
  uploadText="上传帖子图片"
/>
```

**特点：**
- 最多6张图片
- 支持多选文件
- 网格布局显示
- 支持预览和删除

### 2. 评论场景

```tsx
<ImageUpload
  type="comment"
  value={commentImages}
  onChange={setCommentImages}
  maxCount={1}
/>
```

**特点：**
- 最多1张图片
- 单选文件
- 紧凑布局
- 快速上传

### 3. 头像场景

```tsx
<ImageUpload
  type="avatar"
  value={avatarImages}
  onChange={setAvatarImages}
  uploadText="上传头像"
/>
```

**特点：**
- 最多1张图片
- 建议1:1比例
- 圆形预览
- 适合头像使用

### 4. 附件场景

```tsx
<ImageUpload
  type="attachment"
  value={attachmentImages}
  onChange={setAttachmentImages}
  maxCount={5}
/>
```

**特点：**
- 最多5张图片
- 支持多种格式
- 列表式显示
- 适合文档附件

## ⚙️ 环境配置

### 环境变量

在 `.env.local` 文件中配置：

```bash
# 存储类型配置
STORAGE_TYPE=local  # 或 r2

# 本地存储配置
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_BASE_URL=http://localhost:3000

# Cloudflare R2 配置
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=hxzy
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-domain.com

# 文件限制配置
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
MAX_FILES_PER_UPLOAD=6
```

### 本地存储配置

1. 确保 `public/uploads` 目录存在
2. 配置 Next.js 图片域名（`next.config.js`）：

```javascript
module.exports = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      }
    ],
  },
}
```

### Cloudflare R2 配置

1. 创建 R2 存储桶
2. 生成 API 令牌
3. 配置 CORS 策略
4. 设置自定义域名（可选）

## 🔧 技术特性

### 文件验证

- **类型验证：** 只允许图片文件（JPEG、PNG、WebP、GIF）
- **大小限制：** 单文件最大 5MB
- **数量限制：** 根据场景自动限制

### 上传功能

- **多存储支持：** 本地存储 + Cloudflare R2
- **Blob上传：** 支持直接上传 Blob 对象
- **批量上传：** 支持多文件同时上传
- **进度反馈：** 上传状态和错误提示

### 界面特性

- **响应式设计：** 适配不同屏幕尺寸
- **预览功能：** 图片预览和放大查看
- **拖拽上传：** 支持拖拽文件上传
- **删除功能：** 可单独删除已上传图片

## 🎨 自定义样式

### CSS 类名

组件使用以下 CSS 类名，可以通过全局样式覆盖：

```css
.image-upload {
  /* 组件容器 */
}

.image-upload .upload-button {
  /* 上传按钮 */
}

.image-upload .image-preview {
  /* 图片预览 */
}

.image-upload .delete-button {
  /* 删除按钮 */
}
```

### 主题定制

组件使用 Tailwind CSS 类名，可以通过 `className` 属性自定义：

```tsx
<ImageUpload
  type="post"
  value={images}
  onChange={setImages}
  className="custom-upload-style"
/>
```

## 🐛 故障排除

### 常见问题

1. **上传失败**
   - 检查文件大小是否超限
   - 检查文件类型是否支持
   - 检查网络连接

2. **R2 上传失败**
   - 检查 R2 配置是否正确
   - 检查 API 令牌权限
   - 检查存储桶 CORS 设置

3. **图片不显示**
   - 检查图片 URL 是否正确
   - 检查 Next.js 图片域名配置
   - 检查网络访问权限

### 调试模式

在开发环境中，组件会输出详细的调试信息到控制台。

## 📝 更新日志

### v1.0.0
- 初始版本
- 支持四种上传场景
- 支持本地存储和 R2 存储
- 完整的文件验证和错误处理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个组件。

## 📄 许可证

MIT License
