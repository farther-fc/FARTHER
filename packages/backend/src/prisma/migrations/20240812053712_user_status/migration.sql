-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('BANNED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus";
