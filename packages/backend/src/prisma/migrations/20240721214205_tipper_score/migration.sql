-- CreateTable
CREATE TABLE "TipperScore" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "allocationId" TEXT,

    CONSTRAINT "TipperScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipperScore_allocationId_key" ON "TipperScore"("allocationId");

-- CreateIndex
CREATE UNIQUE INDEX "TipperScore_userId_allocationId_key" ON "TipperScore"("userId", "allocationId");

-- AddForeignKey
ALTER TABLE "TipperScore" ADD CONSTRAINT "TipperScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipperScore" ADD CONSTRAINT "TipperScore_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
