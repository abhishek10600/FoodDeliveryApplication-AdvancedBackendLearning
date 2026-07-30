import { Prisma } from "../../../generated/prisma/client.js"
import { translatePrismaError } from "./error.js";
import { prisma } from "./prisma.js";

export abstract class BaseRepository {
  protected readonly prisma = prisma

  protected async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      throw translatePrismaError(error)
    }
  }

  protected async executeInTransaction<T>(tx: Prisma.TransactionClient, operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      throw translatePrismaError(error)
    }
  }
}
