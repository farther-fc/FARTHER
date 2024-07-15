-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "followerCount" INTEGER,
ADD COLUMN     "pfpUrl" TEXT,
ADD COLUMN     "powerBadge" BOOLEAN,
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "EthAccount" (
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EthAccount_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "UserEthAccount" (
    "userId" INTEGER NOT NULL,
    "ethAccountId" TEXT NOT NULL,

    CONSTRAINT "UserEthAccount_pkey" PRIMARY KEY ("userId","ethAccountId")
);

-- AddForeignKey
ALTER TABLE "UserEthAccount" ADD CONSTRAINT "UserEthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEthAccount" ADD CONSTRAINT "UserEthAccount_ethAccountId_fkey" FOREIGN KEY ("ethAccountId") REFERENCES "EthAccount"("address") ON DELETE CASCADE ON UPDATE CASCADE;
