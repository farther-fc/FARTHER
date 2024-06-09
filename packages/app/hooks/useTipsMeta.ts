import { trpcClient } from "@lib/trpcClient";

export function useTipsMeta() {
  const { data, isLoading } = trpcClient.tips.meta.useQuery();

  const eligibleTippers = data?._count?.allowances || 0;

  return {
    createdAt: data?.createdAt,
    tipsMetaLoading: isLoading,
    eligibleTippers,
    tipMinimum: data?.tipMinimum || 0,
    usdPrice: data?.usdPrice || 0,
  };
}
