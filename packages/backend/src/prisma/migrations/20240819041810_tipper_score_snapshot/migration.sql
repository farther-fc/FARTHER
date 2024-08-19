-- AlterTable
ALTER TABLE "TipperScore" ADD COLUMN     "snapshotId" TEXT;

-- CreateTable
CREATE TABLE "TipperScoreSnapshot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipperScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TipperScore" ADD CONSTRAINT "TipperScore_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "TipperScoreSnapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
