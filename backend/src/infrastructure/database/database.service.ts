import { logger } from "../../config/logger.js"
import { prisma } from "./prisma.js";

export const connectDatabase = async (): Promise<void> => {
  try {

    logger.info("Connecting to the database");

    await prisma.$connect()

    logger.info("Connected to the database successfully");

  } catch(error) {
    logger.fatal({
      error
    },
      "Failed to connect to database"
    )

    throw error;
  }

}

export const disconnectDatabase = async (): Promise<void> => {
  try {
    logger.info("Disconnecting from the database")

    await prisma.$disconnect()

    logger.info("Disconnected from the database successfully")
  } catch (error) {
    logger.fatal({
      error
    },
      "Failed to disconnect from the database"
    )
  }
}
