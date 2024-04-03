import { AirdropType } from "@backend/prisma";
import * as z from "zod";
import { Address } from "viem";

function addressValidation(a: string): a is Address {
  return typeof a === "string" && a.startsWith("0x");
}

export const apiSchemas = {
  getMerkleProof: {
    input: z
      .object({
        address: z.string().refine(addressValidation, {
          message: "Invalid address",
        }),
        type: z.nativeEnum(AirdropType),
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
};
