/*
  Warnings:

  - The primary key for the `TokenPrice` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TokenPrice" DROP CONSTRAINT "TokenPrice_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("id");
