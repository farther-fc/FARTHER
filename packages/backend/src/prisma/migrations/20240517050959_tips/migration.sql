-- CreateTable
CREATE TABLE IF NOT EXISTS "Tip" (
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tipperId" INTEGER NOT NULL,
    "tippeeId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TipAllowance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "TipAllowance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tip" DROP CONSTRAINT IF EXISTS "Tip_tipperId_fkey";

ALTER TABLE "Tip" ADD CONSTRAINT "Tip_tipperId_fkey" FOREIGN KEY ("tipperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" DROP CONSTRAINT IF EXISTS "Tip_tippeeId_fkey";
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_tippeeId_fkey" FOREIGN KEY ("tippeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipAllowance" DROP CONSTRAINT IF EXISTS "TipAllowance_userId_fkey";
ALTER TABLE "TipAllowance" ADD CONSTRAINT "TipAllowance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
