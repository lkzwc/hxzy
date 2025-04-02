## Docker 本地调试

npx prisma migrate dev --name init

docker exec -i postgres_container psql -U admin -d hxzydb


docker exec -it postgres_container psql -U admin -d hxzydb 

cat prisma/seed.sql | docker exec -i postgres_container psql -U admin -d hxzydb
## 线上调试
npx prisma generate --no-engine
npx prisma migrate dev --name add_doctor_model
npx prisma db seed