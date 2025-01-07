# 个人主页设计文档

## 页面布局

### 顶部区域
1. 个人信息展示
   - 头像（大尺寸）
   - 用户名
   - 个人简介
   - 注册时间
   - 编辑资料按钮

2. 数据统计
   - 发帖数
   - 获得点赞数
   - 收藏数
   - 关注数/粉丝数（预留）

### 内容区域（Tab 切换）
1. 我的帖子
   - 最新发布的帖子列表
   - 帖子状态（点赞数、评论数、浏览量）
   - 支持分页加载

2. 我的点赞
   - 点赞过的帖子列表
   - 点赞时间
   - 支持取消点赞

3. 我的收藏
   - 收藏的帖子列表
   - 收藏时间
   - 支持取消收藏

4. 我的评论
   - 发表的评论列表
   - 评论的帖子标题
   - 评论时间
   - 收到的回复

## 数据结构

### User 扩展
```prisma
model User {
  // 现有字段...

  // 新增字段
  bio          String?   // 个人简介
  followedBy   Follow[] @relation("Following")
  following    Follow[] @relation("Followers")
  collections  Collection[]
}

// 收藏表
model Collection {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int

  @@unique([userId, postId])
  @@index([userId])
  @@index([postId])
}

// 关注关系表（预留）
model Follow {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  
  follower    User     @relation("Following", fields: [followerId], references: [id])
  followerId  Int
  following   User     @relation("Followers", fields: [followingId], references: [id])
  followingId Int

  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}
```

## API 设计

### 获取用户信息
```typescript
GET /api/users/[id]

// 响应
{
  id: number
  name: string
  image: string
  bio: string
  createdAt: string
  stats: {
    posts: number
    likes: number
    collections: number
    followers: number
    following: number
  }
}
```

### 获取用户帖子列表
```typescript
GET /api/users/[id]/posts
Query: { page: number, limit: number }
```

### 获取点赞列表
```typescript
GET /api/users/[id]/likes
Query: { page: number, limit: number }
```

### 获取收藏列表
```typescript
GET /api/users/[id]/collections
Query: { page: number, limit: number }
```

### 获取评论列表
```typescript
GET /api/users/[id]/comments
Query: { page: number, limit: number }
```

### 更新个人资料
```typescript
PATCH /api/users/[id]
Body: {
  name?: string
  bio?: string
  image?: string
}
```

## 前端实现

### 页面组件结构
```
src/
  app/
    profile/
      page.tsx              # 个人主页
      edit/
        page.tsx            # 编辑资料
      [id]/
        page.tsx           # 查看他人主页
      components/
        ProfileHeader.tsx   # 顶部个人信息
        StatsCard.tsx      # 数据统计卡片
        PostList.tsx       # 帖子列表
        LikeList.tsx       # 点赞列表
        CollectionList.tsx # 收藏列表
        CommentList.tsx    # 评论列表
```

### 交互设计
1. Tab 切换
   - 使用 URL query 参数记录当前 tab
   - 切换时平滑过渡
   - 保持滚动位置

2. 列表加载
   - 无限滚动加载
   - 加载状态显示
   - 空状态提示

3. 编辑功能
   - 头像上传预览
   - 表单验证
   - 保存确认

4. 响应式设计
   - 移动端适配
   - 合理的间距和布局
   - 手势支持

## 性能优化

1. 数据缓存
   - SWR 缓存策略
   - 预加载数据
   - 乐观更新

2. 图片优化
   - 响应式图片
   - 懒加载
   - 渐进式加载

3. 列表优化
   - 虚拟滚动
   - 分页加载
   - 骨架屏

## 后续功能

1. 数据导出
2. 主题设置
3. 消息通知
4. 隐私设置
5. 活动记录
6. 数据分析
7. 个性化推荐
8. 社交分享 