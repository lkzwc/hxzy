# 评论系统开发文档

## 功能概述

评论系统支持以下核心功能：
- 发表评论（支持图片上传）
- 回复评论（多级嵌套）
- 评论点赞
- 实时更新
- 评论排序

## 数据结构设计

### Comment 模型
```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  images    String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 关联
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int

  // 评论的回复
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  parentId  Int?
  replies   Comment[] @relation("CommentReplies")

  // 点赞
  likedBy   CommentLike[]

  @@index([postId])
  @@index([authorId])
  @@index([parentId])
}
```

### 前端接口类型
```typescript
interface Author {
  id: number
  name: string | null
  image: string | null
}

interface Comment {
  id: number
  content: string
  images: string[]
  createdAt: string
  author: Author
  likedBy: { userId: number }[]
  replyTo?: {
    id: number
    name: string | null
  }
  parentId: number | null
}
```

## API 设计

### 获取评论列表
```typescript
GET /api/posts/[id]/comments

// 响应数据结构
{
  id: number
  content: string
  images: string[]
  createdAt: string
  author: {
    id: number
    name: string
    image: string
  }
  likedBy: { userId: number }[]
  replyTo?: {
    id: number
    name: string
  }
  parentId: number | null
}[]
```

### 发表评论
```typescript
POST /api/posts/[id]/comments

// 请求体
{
  content: string
  images?: string[]
  parentId?: number
}

// 响应：新创建的评论对象
```

### 点赞评论
```typescript
POST /api/comments/[id]/like

// 响应
{
  liked: boolean
}
```

## 前端实现

### 评论展示逻辑
1. 一级评论（直接回复帖子）：无缩进
2. 二级及以上评论（回复其他评论）：统一缩进 `ml-8`
3. 显示回复对象信息："回复 xxx"

### 评论排序逻辑
1. 顶级评论按创建时间倒序（最新的在前）
2. 同一评论的回复按创建时间正序（最早的在前）
3. 不同评论的回复按父评论创建时间排序

### 交互设计
1. 评论框
   - 支持文本输入和图片上传
   - 显示回复对象信息
   - 可取消回复
   - 实时预览上传的图片

2. 评论卡片
   - 悬停显示操作按钮（点赞、回复）
   - 点赞状态实时反馈
   - 支持图片预览
   - 显示评论时间（相对时间）

### 性能优化
1. 图片懒加载
2. 评论列表分页
3. 点赞防抖
4. 评论提交节流

## 开发要点

### 评论嵌套处理
1. 数据库设计：使用 `parentId` 自关联
2. API 实现：
   - 获取所有评论后在内存中构建关系
   - 为回复添加被回复者信息
   - 根据业务规则排序

### 用户体验优化
1. 评论提交后自动刷新列表
2. 回复评论时自动滚动到评论框
3. 图片上传时显示预览和进度
4. 评论加载时显示骨架屏

### 安全考虑
1. 评论内容过滤和长度限制
2. 图片上传类型和大小限制
3. 用户权限验证
4. XSS 防护

## 后续优化方向

1. 评论编辑功能
2. 评论删除功能
3. @用户功能
4. 评论通知
5. 评论内容富文本支持
6. 评论搜索功能
7. 评论举报功能
8. 评论数据统计 


model Comment {
  // ... 其他字段
  
  // 外键字段 - 实际存储在数据库中
  postId    Int
  
  // 关系字段 - Prisma用于导航关系的虚拟字段
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
}