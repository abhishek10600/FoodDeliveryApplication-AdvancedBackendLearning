import { prisma } from "./prisma.js";
export const withTransaction = async (operation) => {
    return prisma.$transaction(async (tx) => {
        return operation(tx);
    });
};
