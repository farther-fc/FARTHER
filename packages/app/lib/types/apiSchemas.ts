import { AllocationType } from "@farther/backend";
import * as z from "zod";
import { Address } from "viem";

function addressValidation(a: string): a is Address {
  return typeof a === "string" && a.startsWith("0x");
}

export const apiSchemas = {
  getMerkleProof: {
    input: z
      .object({
        id: z.string(),
      })
      .nullish(),
  },
  setAllocationClaimed: {
    input: z.object({
      allocationId: z.string(),
    }),
  },
  getUser: {
    input: z.object({
      address: z.string().refine(addressValidation, {
        message: "Invalid address",
      }),
    }),
  },
  validateTweet: {
    input: z.object({
      tweetId: z.string(),
      fid: z.coerce.number().int().gte(0).lte(100_000_000_000),
    }),
  },
};
