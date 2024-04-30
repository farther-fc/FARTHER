-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_allocationId_fkey";

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
