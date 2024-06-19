import { trpcClient } from "@lib/trpcClient";

export function useTipsMeta() {
  const { data, isLoading } = trpcClient.public.tips.meta.useQuery();

  const latestTipMeta = data?.[0];

  const eligibleTippers = latestTipMeta?._count?.allowances || 0;

  return {
    createdAt: latestTipMeta?.createdAt,
    tipsMetaLoading: isLoading,
    eligibleTippers,
    tipMinimum: latestTipMeta?.tipMinimum || 0,
    usdPrice: latestTipMeta?.usdPrice || 0,
  };
}
