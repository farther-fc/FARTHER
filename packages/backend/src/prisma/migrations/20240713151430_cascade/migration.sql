-- DropForeignKey
ALTER TABLE "Allocation" DROP CONSTRAINT "Allocation_airdropId_fkey";

-- DropForeignKey
ALTER TABLE "Allocation" DROP CONSTRAINT "Allocation_userId_fkey";

-- DropForeignKey
ALTER TABLE "OpenRankScore" DROP CONSTRAINT "OpenRankScore_snapshotId_fkey";

-- DropForeignKey
ALTER TABLE "OpenRankScore" DROP CONSTRAINT "OpenRankScore_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tip" DROP CONSTRAINT "Tip_allocationId_fkey";

-- DropForeignKey
ALTER TABLE "Tip" DROP CONSTRAINT "Tip_tipAllowanceId_fkey";

-- DropForeignKey
ALTER TABLE "Tip" DROP CONSTRAINT "Tip_tippeeId_fkey";

-- DropForeignKey
ALTER TABLE "Tip" DROP CONSTRAINT "Tip_tipperId_fkey";

-- DropForeignKey
ALTER TABLE "TipAllowance" DROP CONSTRAINT "TipAllowance_tipMetaId_fkey";

-- DropForeignKey
ALTER TABLE "TipAllowance" DROP CONSTRAINT "TipAllowance_userId_fkey";

-- DropForeignKey
ALTER TABLE "TipScore" DROP CONSTRAINT "TipScore_allocationId_fkey";

-- DropForeignKey
ALTER TABLE "TipScore" DROP CONSTRAINT "TipScore_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_allocationId_fkey";

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_airdropId_fkey" FOREIGN KEY ("airdropId") REFERENCES "Airdrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_tipperId_fkey" FOREIGN KEY ("tipperId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_tippeeId_fkey" FOREIGN KEY ("tippeeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_tipAllowanceId_fkey" FOREIGN KEY ("tipAllowanceId") REFERENCES "TipAllowance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipAllowance" ADD CONSTRAINT "TipAllowance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipAllowance" ADD CONSTRAINT "TipAllowance_tipMetaId_fkey" FOREIGN KEY ("tipMetaId") REFERENCES "TipMeta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenRankScore" ADD CONSTRAINT "OpenRankScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenRankScore" ADD CONSTRAINT "OpenRankScore_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "OpenRankSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipScore" ADD CONSTRAINT "TipScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipScore" ADD CONSTRAINT "TipScore_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "Allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
