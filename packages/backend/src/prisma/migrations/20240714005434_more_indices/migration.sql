-- CreateIndex
CREATE INDEX "OpenRankScore_userId_idx" ON "OpenRankScore"("userId");

-- CreateIndex
CREATE INDEX "OpenRankScore_createdAt_idx" ON "OpenRankScore"("createdAt");

-- CreateIndex
CREATE INDEX "OpenRankScore_userId_createdAt_idx" ON "OpenRankScore"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Tip_createdAt_idx" ON "Tip"("createdAt");

-- CreateIndex
CREATE INDEX "Tip_tipperId_idx" ON "Tip"("tipperId");

-- CreateIndex
CREATE INDEX "Tip_tippeeId_idx" ON "Tip"("tippeeId");

-- CreateIndex
CREATE INDEX "Tip_tipperId_tippeeId_idx" ON "Tip"("tipperId", "tippeeId");

-- CreateIndex
CREATE INDEX "Tip_tipAllowanceId_idx" ON "Tip"("tipAllowanceId");

-- CreateIndex
CREATE INDEX "Tip_allocationId_idx" ON "Tip"("allocationId");

-- CreateIndex
CREATE INDEX "TipAllowance_userId_idx" ON "TipAllowance"("userId");

-- CreateIndex
CREATE INDEX "TipAllowance_tipMetaId_idx" ON "TipAllowance"("tipMetaId");
