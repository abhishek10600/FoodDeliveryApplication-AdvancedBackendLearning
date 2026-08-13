import { container } from "tsyringe";
import { prisma } from "./prisma.js";
import { InfrastructureTokens } from "../container/index.js";
export const registerQueryLogger = () => {
    const logger = container.resolve(InfrastructureTokens.Logger);
    prisma.$on("query", (event) => {
        logger.debug("Database query executed", {
            component: "database",
            query: event.query,
            duration: event.duration,
            target: event.target
        });
    });
};
