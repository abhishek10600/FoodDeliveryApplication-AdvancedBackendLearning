import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export type PrismaExecutor =
  | PrismaClient
  | Prisma.TransactionClient
