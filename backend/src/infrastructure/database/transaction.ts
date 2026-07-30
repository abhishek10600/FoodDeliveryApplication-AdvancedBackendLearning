import { Prisma } from "../../../generated/prisma/client.js"
import { prisma } from "./prisma.js"

export const withTransaction = async <T>(operation: (tx: Prisma.TransactionClient)=> Promise<T> ): Promise<T> => {
  return prisma.$transaction(async (tx) => {
    return operation(tx)
  })
}
