-- AlterTable
ALTER TABLE "Allocation" ADD COLUMN     "newId" UUID NOT NULL DEFAULT gen_random_uuid();
