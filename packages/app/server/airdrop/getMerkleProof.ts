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

    const { id } = opts.input;

    try {
      const airdrop = await prisma.airdrop.findFirst({
        where: {
          allocations: {
            some: {
              id,
            },
          },
        },
        select: {
          id: true,
          amount: true,
          allocations: {
            select: {
              index: true,
              address: true,
              amount: true,
            },
          },
          root: true,
        },
      });

      if (!airdrop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Airdrop not found for allocation id ${id}`,
        });
      }

      const currentRecipient = await prisma.user.findFirst({
        where: {
          allocations: {
            some: {
              id,
            },
          },
        },
        select: {
          fid: true,
          allocations: true,
        },
      });

      if (!currentRecipient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User not found for allocation id ${id}`,
        });
      }

      if (!currentRecipient.allocations[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Airdrop allocation not found for allocation ID ${id}`,
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
          fid: true,
        },
      });

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
          !r.allocations[0].address ||
          !r.allocations[0].amount
        ) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Invalid recipient data. index: ${r.allocations[0].index}, address: ${r.allocations[0].address}, amount: ${r.allocations[0].amount}`,
          });
        }
        return {
          index: r.allocations[0].index,
          address: r.allocations[0].address as `0x${string}`,
          amount: r.allocations[0].amount,
        };
      });

      unhashedLeaves.sort((a, b) => a.index - b.index);

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
        address: currentRecipient.allocations[0].address as `0x${string}`,
        amount: currentRecipient.allocations[0].amount,
      });

      // Sanity check
      if (
        !validateProof({
          proof,
          root,
          leaf: {
            index,
            address: currentRecipient.allocations[0].address as `0x${string}`,
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
