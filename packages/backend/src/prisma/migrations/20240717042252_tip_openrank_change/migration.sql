/*
  Warnings:

  - You are about to drop the column `latestFartherScore` on the `Tip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "latestFartherScore",
ADD COLUMN     "openRankChange" DOUBLE PRECISION;
