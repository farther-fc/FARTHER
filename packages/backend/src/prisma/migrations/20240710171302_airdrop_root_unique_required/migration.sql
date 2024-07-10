/*
  Warnings:

  - A unique constraint covering the columns `[root]` on the table `Airdrop` will be added. If there are existing duplicate values, this will fail.
  - Made the column `root` on table `Airdrop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Airdrop" ALTER COLUMN "root" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Airdrop_root_key" ON "Airdrop"("root");
