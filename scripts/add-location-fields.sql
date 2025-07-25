-- 为Post表添加位置信息字段
-- 如果数据库迁移失败，可以手动执行此SQL

-- 添加省份字段
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "province" TEXT;

-- 为位置字段添加索引（可选，用于后续基于位置的查询优化）
CREATE INDEX IF NOT EXISTS "Post_province_idx" ON "Post"("province");

-- 查看表结构确认字段已添加
-- \d "Post"
