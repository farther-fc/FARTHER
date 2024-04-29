/*
  Warnings:

  - You are about to drop the column `number` on the `Airdrop` table. All the data in the column will be lost.
  - You are about to drop the column `supply` on the `Airdrop` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Airdrop_number_chainId_key";

-- DropIndex
DROP INDEX "Airdrop_number_key";

-- AlterTable
ALTER TABLE "Airdrop" DROP COLUMN "number",
DROP COLUMN "supply";
