/*
  Warnings:

  - You are about to drop the column `spent` on the `TipAllowance` table. All the data in the column will be lost.
  - Added the required column `tipAllowanceId` to the `Tip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tip" ADD COLUMN     "tipAllowanceId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "TipAllowance" DROP COLUMN "spent";

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_tipAllowanceId_fkey" FOREIGN KEY ("tipAllowanceId") REFERENCES "TipAllowance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
