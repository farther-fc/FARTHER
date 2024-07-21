import { API_BATCH_LIMIT, cacheTypes } from "@farther/common";
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
  publicTipsByTipper: {
    input: z.object({
      fid: z.coerce.number().int().gte(0).lte(100_000_000_000),
      cursor: z.number().int().min(0).max(8640000000000000).optional(),
      from: z.number().int().min(0).max(8640000000000000).optional(),
      order: z.enum(["asc", "desc"]).default("asc").optional(),
      limit: z.number().min(1).max(API_BATCH_LIMIT).optional(),
    }),
  },
  flushCacheType: {
    input: z.object({
      type: z.enum([
        cacheTypes.USER,
        cacheTypes.USER_TIPS,
        cacheTypes.TIP_META,
        cacheTypes.LEADERBOARD,
      ]),
    }),
  },
};
