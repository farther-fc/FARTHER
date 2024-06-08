/*
  Warnings:

  - You are about to drop the column `isValidTip` on the `Tip` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InvalidTipReason" AS ENUM ('BELOW_MINIMUM', 'INSUFFICIENT_ALLOWANCE', 'NULL_ALLOWANCE');

-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "isValidTip",
ADD COLUMN     "invalidTipReason" "InvalidTipReason";
