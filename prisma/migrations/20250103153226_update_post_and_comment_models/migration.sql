-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "published" SET DEFAULT false;
