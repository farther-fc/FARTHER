-- DropForeignKey
ALTER TABLE "TipAllowance" DROP CONSTRAINT "TipAllowance_tipMetaId_fkey";

-- AlterTable
ALTER TABLE "TipAllowance" ALTER COLUMN "tipMetaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TipAllowance" ADD CONSTRAINT "TipAllowance_tipMetaId_fkey" FOREIGN KEY ("tipMetaId") REFERENCES "TipMeta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
