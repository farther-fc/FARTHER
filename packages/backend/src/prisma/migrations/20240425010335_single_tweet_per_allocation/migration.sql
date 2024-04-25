/*
  Warnings:

  - A unique constraint covering the columns `[allocationId]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tweet_allocationId_key" ON "Tweet"("allocationId");
