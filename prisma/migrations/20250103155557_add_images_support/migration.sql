-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "images" TEXT[],
ALTER COLUMN "published" SET DEFAULT true;
