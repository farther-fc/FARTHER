/*
  Warnings:

  - You are about to drop the column `newId` on the `Allocation` table. All the data in the column will be lost.
  - You are about to drop the column `newAllocationId` on the `Tweet` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Allocation_newId_key";

-- AlterTable
ALTER TABLE "Allocation" DROP COLUMN "newId";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "newAllocationId";
