import { createContainer } from "@lib/context/unstated";
import { trpcClient } from "@lib/trpcClient";

export const TokenInfoContext = createContainer(function () {
  const { data, isLoading: priceLoading } = trpcClient.token.price.useQuery();

  return {
    fartherUsdPrice: data?.usd || 0,
    priceLoading,
  };
});

export const useTokenInfo = TokenInfoContext.useContainer;

export const TokenInfoProvider = TokenInfoContext.Provider;
