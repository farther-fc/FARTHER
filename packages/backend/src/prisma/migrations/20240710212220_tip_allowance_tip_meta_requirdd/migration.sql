/*
  Warnings:

  - Made the column `tipMetaId` on table `TipAllowance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TipAllowance" DROP CONSTRAINT "TipAllowance_tipMetaId_fkey";

-- AlterTable
ALTER TABLE "TipAllowance" ALTER COLUMN "tipMetaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TipAllowance" ADD CONSTRAINT "TipAllowance_tipMetaId_fkey" FOREIGN KEY ("tipMetaId") REFERENCES "TipMeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
