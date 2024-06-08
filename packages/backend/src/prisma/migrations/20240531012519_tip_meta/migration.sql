/*
  Warnings:

  - Added the required column `tipMetaId` to the `TipAllowance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TipAllowance" ADD COLUMN IF NOT EXISTS "tipMetaId" UUID NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "TipMeta" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "carriedOver" TEXT NOT NULL,

    CONSTRAINT "TipMeta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TipAllowance" DROP CONSTRAINT IF EXISTS "TipAllowance_tipMetaId_fkey";
ALTER TABLE "TipAllowance" ADD CONSTRAINT "TipAllowance_tipMetaId_fkey" FOREIGN KEY ("tipMetaId") REFERENCES "TipMeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
