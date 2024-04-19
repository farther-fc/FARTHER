-- CreateEnum
CREATE TYPE "AllocationType" AS ENUM ('POWER_USER', 'EVANGELIST');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allocation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "airdropId" UUID,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "type" "AllocationType" NOT NULL,
    "amount" TEXT NOT NULL,
    "index" INTEGER,

    CONSTRAINT "Allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "allocationId" UUID NOT NULL,
    "tweetId" TEXT NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airdrop" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "number" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chainId" INTEGER NOT NULL,
    "address" TEXT,
    "root" TEXT,
    "amount" TEXT NOT NULL,
    "supply" TEXT,

    CONSTRAINT "Airdrop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_fid_key" ON "User"("fid");

-- CreateIndex
CREATE UNIQUE INDEX "Allocation_userId_airdropId_key" ON "Allocation"("userId", "airdropId");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_allocationId_key" ON "Tweet"("allocationId");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_tweetId_key" ON "Tweet"("tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_allocationId_tweetId_key" ON "Tweet"("allocationId", "tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "Airdrop_number_key" ON "Airdrop"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Airdrop_number_chainId_key" ON "Airdrop"("number", "chainId");

-- CreateIndex
CREATE UNIQUE INDEX "Airdrop_address_chainId_key" ON "Airdrop"("address", "chainId");

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_airdropId_fkey" FOREIGN KEY ("airdropId") REFERENCES "Airdrop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

