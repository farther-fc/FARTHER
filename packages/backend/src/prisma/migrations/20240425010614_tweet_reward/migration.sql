/*
  Warnings:

  - Added the required column `reward` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tweet_allocationId_key";

-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "reward" TEXT NOT NULL;
