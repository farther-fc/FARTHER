/*
  Warnings:

  - Added the required column `usdPrice` to the `TipMeta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TipMeta" ADD COLUMN     "usdPrice" DOUBLE PRECISION NOT NULL;
