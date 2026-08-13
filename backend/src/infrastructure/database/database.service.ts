import { injectable, inject } from "tsyringe";
import { registerQueryLogger } from "./query-logger.js";
import { InfrastructureTokens } from "../container/index.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { ILogger } from "../../shared/logger/logger.interface.js";
import { LoggerFactory } from "../observeability/logger/logger.factory.js";


@injectable()
export class DatabaseService {

  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaClient,

    @inject(InfrastructureTokens.Logger)
    private readonly logger: ILogger,

    loggerFactory: LoggerFactory

  ) {
    this.logger = loggerFactory.create({
      component: "DatabaseService",
      module: "infrastructure"
    })
  }

  connectDatabase = async (): Promise<void> => {
    try {

      this.logger.info("Connecting to the database", {
        event: "DATABASE_CONNECTED",
        component: "database",
        operation: "connect"
      });

      registerQueryLogger()

      await this.prisma.$connect()

      this.logger.info("Connected to the database successfully");

    } catch(error: unknown) {
      this.logger.fatal(
        "Failed to connect to database",
        error,
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
      this.logger.fatal( "Failed to disconnect from the database", error
      )
    }
  }

  checkDatabaseHealth = async () => {
    try {
      const start = process.hrtime.bigint();

      await this.prisma.$queryRaw`SELECT 1`;

      const latency = Number(process.hrtime.bigint() - start) / 1_000_000;

      return {
        status: "healthy",
        latency
      }

    } catch (error) {
      return {
        status: "unhealthy"
      }
    }
  }

  public getClient = (): PrismaClient => {
    return this.prisma
  }
}
