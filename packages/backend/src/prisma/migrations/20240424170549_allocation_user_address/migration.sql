/*
  Warnings:

  - Added the required column `address` to the `Allocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Allocation" ADD COLUMN     "address" TEXT NOT NULL;
