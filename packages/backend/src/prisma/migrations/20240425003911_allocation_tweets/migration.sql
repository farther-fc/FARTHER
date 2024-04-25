-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
