import { injectable, inject } from "tsyringe";
import { registerQueryLogger } from "./query-logger.js";
import { InfrastructureTokens } from "../container/index.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { Logger } from "pino";


@injectable()
export class DatabaseService {

  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaClient,

    @inject(InfrastructureTokens.Logger)
    private readonly logger: Logger

  ) { }

  connectDatabase = async (): Promise<void> => {
    try {

      this.logger.info("Connecting to the database");

      registerQueryLogger()

      await this.prisma.$connect()

      this.logger.info("Connected to the database successfully");

    } catch(error) {
      this.logger.fatal({
        error
      },
        "Failed to connect to database"
      )

      throw error;
    }

  }

  disconnectDatabase = async (): Promise<void> => {
    try {
      this.logger.info("Disconnecting from the database")

      await this.prisma.$disconnect()

      this.logger.info("Disconnected from the database successfully")
    } catch (error) {
      this.logger.fatal({
        error
      },
        "Failed to disconnect from the database"
      )
    }
  }
}
