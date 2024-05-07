/*
  Warnings:

  - A unique constraint covering the columns `[newId]` on the table `Allocation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "newAllocationId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Allocation_newId_key" ON "Allocation"("newId");
