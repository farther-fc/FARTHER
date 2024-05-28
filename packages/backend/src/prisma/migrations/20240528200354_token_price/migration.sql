-- CreateTable
CREATE TABLE "TokenPrice" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "price" TEXT NOT NULL,

    CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("id")
);
