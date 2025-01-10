npx prisma migrate dev --name add_doctor_model

echo "TRUNCATE \"PostLike\" CASCADE; TRUNCATE \"Comment\" CASCADE; TRUNCATE \"Post\" CASCADE; TRUNCATE \"User\" CASCADE; TRUNCATE \"Doctor\" CASCADE;" | docker exec -i postgres_container psql -U admin -d hxzydb


docker exec -it postgres_container psql -U admin -d hxzydb 

cat prisma/seed.sql | docker exec -i postgres_container psql -U admin -d hxzydb