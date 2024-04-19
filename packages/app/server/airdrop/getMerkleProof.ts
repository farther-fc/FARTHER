import { prisma } from "@farther/backend";
import {
  getMerkleProof as getProof,
  getMerkleRoot,
  validateProof,
} from "@farther/common";
import { publicProcedure } from "server/trpc";
import { TRPCError } from "@trpc/server";
import { apiSchemas } from "@lib/types/apiSchemas";

export const getMerkleProof = publicProcedure
  .input(apiSchemas.getMerkleProof.input)
  .query(async (opts) => {
    if (!opts.input) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No input provided",
      });
    }

    const { address, type } = opts.input;

    try {
      const airdrop = await prisma.airdrop.findFirst({
        where: {
          allocations: {
            some: {
              type,
              user: {
                address: address.toLowerCase(),
              },
            },
          },
        },
      });

      if (!airdrop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Airdrop not found for address ${address}`,
        });
      }

      // Get all users with allocations for this airdrop
      const recipients = await prisma.user.findMany({
        where: {
          allocations: {
            some: {
              airdropId: airdrop.id,
            },
          },
        },
        select: {
          allocations: true,
          address: true,
        },
      });

      const currentRecipient = recipients.find(
        (r) => r.address === address.toLowerCase(),
      );

      if (!currentRecipient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Airdrop allocation not found for address ${address}`,
        });
      }

      const allocationSum = recipients.reduce(
        (acc, r) => acc + BigInt(r.allocations[0].amount),
        BigInt(0),
      );

      const airdropAmount = BigInt(airdrop.amount);

      if (allocationSum !== airdropAmount) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Airdrop amount mismatch. airdropAmount: ${airdropAmount}, allocationSum: ${allocationSum}`,
        });
      }

      // Create a merkle tree with the above recipients
      const unhashedLeaves = recipients.map((r) => {
        if (
          typeof r.allocations[0].index !== "number" ||
          !r.address ||
          !r.allocations[0].amount
        )
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Invalid recipient data. index: ${r.allocations[0].index}, address: ${r.address}, amount: ${r.allocations[0].amount}`,
          });
        return {
          index: r.allocations[0].index,
          address: r.address as `0x${string}`,
          amount: r.allocations[0].amount,
        };
      });

      const root = getMerkleRoot(unhashedLeaves);

      if (root !== airdrop.root) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Merkle root mismatch. airdrop.root: ${airdrop.root}, calculated root: ${root}`,
        });
      }

      // We can assert this as a number because we throw an error earlier if it's not a number
      const index = currentRecipient.allocations[0].index as number;

      const proof = getProof({
        unhashedLeaves,
        index,
        address,
        amount: currentRecipient.allocations[0].amount,
      });

      // Sanity check
      if (
        !validateProof({
          proof,
          root,
          leaf: {
            index,
            address,
            amount: currentRecipient.allocations[0].amount,
          },
        })
      ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to validate merkle proof.`,
        });
      }

      return proof;
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  });
