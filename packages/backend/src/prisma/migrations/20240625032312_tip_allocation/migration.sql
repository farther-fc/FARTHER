-- AlterTable
ALTER TABLE "Tip" ADD COLUMN     "allocationId" TEXT;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
