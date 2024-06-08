/*
  Warnings:

  - You are about to drop the column `dailyTotal` on the `TipMeta` table. All the data in the column will be lost.
  - Added the required column `totalAllowance` to the `TipMeta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TipMeta" DROP COLUMN "dailyTotal",
ADD COLUMN     "totalAllowance" TEXT NOT NULL;
