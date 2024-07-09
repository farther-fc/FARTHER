-- CreateTable
CREATE TABLE "OpenRankScore" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "snapshotId" TEXT NOT NULL,

    CONSTRAINT "OpenRankScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenRankSnapshot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenRankSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpenRankScore_userId_snapshotId_key" ON "OpenRankScore"("userId", "snapshotId");

-- AddForeignKey
ALTER TABLE "OpenRankScore" ADD CONSTRAINT "OpenRankScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenRankScore" ADD CONSTRAINT "OpenRankScore_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "OpenRankSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
