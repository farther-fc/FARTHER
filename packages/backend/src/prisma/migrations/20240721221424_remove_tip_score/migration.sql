/*
  Warnings:

  - You are about to drop the `TipScore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE IF EXISTS "TipScore" DROP CONSTRAINT IF EXISTS "TipScore_allocationId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "TipScore" DROP CONSTRAINT IF EXISTS "TipScore_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "TipScore";
