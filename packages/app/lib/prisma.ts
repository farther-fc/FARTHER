import { isProduction } from "./env";
import { PrismaClient } from "../../backend/prisma";

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
