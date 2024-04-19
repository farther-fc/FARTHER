import { prisma } from "@farther/backend";
import { publicProcedure } from "server/trpc";
import { apiSchemas } from "@lib/types/apiSchemas";

export const setAllocationClaimed = publicProcedure
  .input(apiSchemas.setAllocationClaimed.input)
  .mutation(async (opts) => {
    const { allocationId } = opts.input;

    // Update allocation to claimed
    await prisma.allocation.update({
      where: { id: allocationId },
      data: { isClaimed: true },
    });

    return true;
  });
