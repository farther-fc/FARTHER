/*
  Warnings:

  - The primary key for the `Tweet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tweetId` on the `Tweet` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tweet_allocationId_tweetId_key";

-- DropIndex
DROP INDEX "Tweet_tweetId_key";

-- AlterTable
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_pkey",
DROP COLUMN "tweetId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id");
