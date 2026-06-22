# 华夏中医项目记忆

## 项目概况
- 项目名称: 华夏中医 (huaxia-tcm)，域名 hxzy.life，版本 0.1.0
- 技术栈: Next.js 16 (App Router) + React 19 + TypeScript 5 + Prisma 5 + PostgreSQL + NextAuth 4 + Ant Design 5 + Tailwind CSS 3 + SWR
- 部署: Docker Compose (app + postgres)，图片存储支持本地和 Cloudflare R2 双模式
- 构建命令: `npm run build:prod` (含 prisma generate + migrate deploy)
- 帖子内容限制: 280字符，最多9张图片
- 社区分类: 全部、经方、针灸、祝由、艾灸、推拿、中药、诊断、医案、闲谈、市场
- 数据库索引精细，所有高频查询均建了复合索引
- 微信登录使用简化凭证模式，非完整 OAuth 流程
