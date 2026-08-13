import { pino } from "pino";
import { env } from "../../../config/env.config.js";
export const pinoLogger = pino({
    transport: env.NODE_ENV === "development" ? {
        target: "pino-pretty"
    } : undefined,
    base: {
        service: env.APP_NAME,
        environment: env.NODE_ENV
    },
    timestamp: pino.stdTimeFunctions.isoTime
});
