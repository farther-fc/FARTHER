import { Address } from "viem";
import * as z from "zod";

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
  publicGetUserByAddress: {
    input: z.object({
      address: z.string().refine(addressValidation, {
        message: "Invalid address",
      }),
    }),
  },
  publicGetUserByFid: {
    input: z.object({
      fid: z.coerce.number().int().gte(0).lte(100_000_000_000),
    }),
  },
  publicGetTipsMeta: {
    input: z
      .object({
        date: z.string().datetime(),
      })
      .optional(),
  },
  validateTweet: {
    input: z.object({
      tweetId: z.string(),
      fid: z.coerce.number().int().gte(0).lte(100_000_000_000),
    }),
  },
};
