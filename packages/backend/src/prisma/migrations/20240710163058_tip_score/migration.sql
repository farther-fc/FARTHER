-- AlterEnum
ALTER TYPE "AllocationType" ADD VALUE 'TIPPER';

-- AlterTable
ALTER TABLE "Tip" ADD COLUMN     "latestScore" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "TipScore" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "allocationId" TEXT,

    CONSTRAINT "TipScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipScore_allocationId_key" ON "TipScore"("allocationId");

-- CreateIndex
CREATE UNIQUE INDEX "TipScore_userId_allocationId_key" ON "TipScore"("userId", "allocationId");

-- AddForeignKey
ALTER TABLE "TipScore" ADD CONSTRAINT "TipScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipScore" ADD CONSTRAINT "TipScore_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
