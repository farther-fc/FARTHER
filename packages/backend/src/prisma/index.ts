export * from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { isProduction } from "@common/env";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      // "query",
      //  "info",
      "warn",
      "error",
    ],
  });

if (isProduction) globalForPrisma.prisma = prisma;
