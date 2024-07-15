/*
  Warnings:

  - Added the required column `updatedAt` to the `OpenRankScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OpenRankSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TipScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OpenRankScore" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OpenRankSnapshot" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TipScore" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
