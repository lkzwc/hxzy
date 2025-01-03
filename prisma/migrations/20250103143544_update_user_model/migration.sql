/*
  Warnings:

  - You are about to drop the column `createat` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[githubId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createat",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "githubId" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "name" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
