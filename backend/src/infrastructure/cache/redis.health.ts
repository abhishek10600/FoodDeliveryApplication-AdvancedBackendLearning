import { logger } from "../../config/logger.js";
import redis from "./redis.js"

export const checkRedisHealth = async() => {
  try {
    const start = process.hrtime.bigint();

    await redis.ping()

    const latency = Number(process.hrtime.bigint() - start) / 1_000_000;

    return {
      status: "healthy",
      latency
    }

  } catch (error) {

    logger.error({
      error
    }, "Redis health check failed")

    return {
      status: "unhealthy"
    }
  }
}
