/*
  Warnings:

  - Added the required column `updatedAt` to the `TipScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OpenRankScore" ADD COLUMN IF NOT EXISTS    "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OpenRankSnapshot" ADD COLUMN IF NOT EXISTS    "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TipScore" ADD COLUMN IF NOT EXISTS    "updatedAt" TIMESTAMP(3) NOT NULL;
