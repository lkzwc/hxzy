/*
  Warnings:

  - You are about to drop the `QrCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "QrCode";

-- CreateTable
CREATE TABLE "AdQrcode" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdQrcode_pkey" PRIMARY KEY ("id")
);
