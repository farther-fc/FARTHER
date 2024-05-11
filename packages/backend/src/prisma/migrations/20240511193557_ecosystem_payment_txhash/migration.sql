/*
  Warnings:

  - You are about to drop the `EcosystemFundPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EcosystemFundPayment";

-- CreateTable
CREATE TABLE "EcosystemPayment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,

    CONSTRAINT "EcosystemPayment_pkey" PRIMARY KEY ("id")
);
