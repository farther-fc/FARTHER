import { AllocationType, prisma } from "@farther/backend";
import {
  getMerkleRoot,
  getMerkleProof as getProof,
  validateProof,
} from "@farther/common";
import { apiSchemas } from "@lib/types/apiSchemas";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "server/trpc";

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
            every: {
              type: AllocationType.POWER_USER,
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

      console.log();

      const allocationsWithNullIndex = airdrop?.allocations.filter(
        (a) => typeof a.index !== "number",
      );
      console.log({ allocationsWithNullIndex });

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

      const recipients = airdrop.allocations;

      const allocationSum = recipients.reduce(
        (acc, r) => acc + BigInt(r.amount),
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
        if (typeof r.index !== "number" || !r.address || !r.amount) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Invalid recipient data. index: ${r.index}, address: ${r.address}, amount: ${r.amount}`,
          });
        }
        return {
          index: r.index,
          address: r.address as `0x${string}`,
          amount: r.amount,
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
