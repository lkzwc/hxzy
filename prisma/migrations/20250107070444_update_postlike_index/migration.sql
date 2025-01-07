/*
  Warnings:

  - The primary key for the `PostLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PostLike` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PostLike_userId_postId_key";

-- AlterTable
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PostLike_pkey" PRIMARY KEY ("userId", "postId");
