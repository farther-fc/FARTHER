/*
  Warnings:

  - You are about to drop the column `price` on the `TokenPrice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TokenPrice" DROP COLUMN "price",
ADD COLUMN     "usd" DOUBLE PRECISION NOT NULL DEFAULT 0;
