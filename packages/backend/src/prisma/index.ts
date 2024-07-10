export * from "@prisma/client";
import { isProduction } from "@farther/common";
import { Prisma, PrismaClient } from "@prisma/client";

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

export type Tables = (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName];
