/*
  Warnings:

  - You are about to drop the column `altScore` on the `TipperScore` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InvalidTipReason" ADD VALUE 'TIPPEE_WEEKLY_THRESHOLD_REACHED';
ALTER TYPE "InvalidTipReason" ADD VALUE 'RECIPROCATION_THRESHOLD_REACHED';

-- AlterTable
ALTER TABLE "TipperScore" DROP COLUMN "altScore";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fartherBotSubscriber" BOOLEAN NOT NULL DEFAULT false;
