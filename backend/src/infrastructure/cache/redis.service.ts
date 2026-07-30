import { logger } from "../../config/logger.js"
import redis from "./redis.js";

export const connectRedis = async() => {
  try {
    logger.info("Connecting to redis");

    await redis.connect()

    logger.info("Connected to redis successfully")

  } catch (error) {
    logger.fatal({
      error
    }, "Failed to connect to Redis")
  }
}

export const disconnectRedis = async() => {
  try {
    logger.info("Disconnecting from redis")

    await redis.quit()

    logger.info("Disconnected from redis successfully")

  } catch (error) {
    logger.fatal({
      error
    }, "Failed to disconnect redis")
  }
}
