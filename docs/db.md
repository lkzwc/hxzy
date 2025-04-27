## Docker 调试
### 启动docker 
```
version: '3.7'

services:
  db:
    image: postgres:latest
    container_name: my-postgres-db
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=mypassword
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
volumes:
  postgres_data:

```
docker-compose up -d
### 修改env配置
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb"

### 初始化数据库
npx prisma migrate dev --name init

### 添加测试数据
cat prisma/seed.sql | docker exec -i postgres_container psql -U admin -d hxzydb

### 查看数据库相关信息
docker exec -i my-postgres-db psql -U myuser -d mydb
