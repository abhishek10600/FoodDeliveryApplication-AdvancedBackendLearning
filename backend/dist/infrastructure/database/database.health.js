import { prisma } from "./prisma.js";
export const checkDatabaseHealth = async () => {
    try {
        const start = process.hrtime.bigint();
        await prisma.$queryRaw `SELECT 1`;
        const latency = Number(process.hrtime.bigint() - start) / 1_000_000;
        return {
            status: "healthy",
            latency
        };
    }
    catch {
        return {
            status: "unhealthy"
        };
    }
};
