import { API_ENDPOINT_ROOT, axios } from "@farther/common";

export async function getPrice(): Promise<number> {
  const priceResponse = await axios(API_ENDPOINT_ROOT + "/public.token.price");

  const { usd } = priceResponse.data.result.data;

  return usd;
}
