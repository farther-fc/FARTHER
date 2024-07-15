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
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EthAccount_pkey" PRIMARY KEY ("address")
);

-- AddForeignKey
ALTER TABLE "EthAccount" ADD CONSTRAINT "EthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
