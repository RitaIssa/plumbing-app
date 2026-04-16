// This file creates a single shared Prisma client instance.
// In development, Next.js hot-reloads the server which would create many DB connections.
// We store the client on the global object to reuse it across reloads.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // logs all DB queries in the terminal (helpful for debugging)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
