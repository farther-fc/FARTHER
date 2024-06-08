/*
  Warnings:

  - Added the required column `spent` to the `TipAllowance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TipAllowance" ADD COLUMN     "spent" TEXT NOT NULL;
