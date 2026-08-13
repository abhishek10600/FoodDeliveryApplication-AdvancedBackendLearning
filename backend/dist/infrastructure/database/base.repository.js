import { translatePrismaError } from "./error.js";
import { prisma } from "./prisma.js";
export class BaseRepository {
    prisma = prisma;
    async execute(operation) {
        try {
            return await operation();
        }
        catch (error) {
            throw translatePrismaError(error);
        }
    }
    async executeInTransaction(tx, operation) {
        try {
            return await operation();
        }
        catch (error) {
            throw translatePrismaError(error);
        }
    }
}
