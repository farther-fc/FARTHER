/*
  Warnings:

  - You are about to drop the column `latestScore` on the `Tip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "latestScore",
ADD COLUMN     "latestFartherScore" DOUBLE PRECISION,
ADD COLUMN     "tippeeOpenRankScore" DOUBLE PRECISION;
