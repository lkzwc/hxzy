# Docker 部署

## 快速启动

```bash
docker compose up
```

访问 http://localhost:3000

## 停止服务

```bash
docker compose down
```

## 环境变量配置

如需配置第三方登录，创建 `.env` 文件：

```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 服务说明

- **app**: Next.js 应用 (端口 3000)
- **postgres**: PostgreSQL 数据库 (端口 5432)

数据库会自动初始化，上传的文件保存在 `./public/uploads` 目录。
