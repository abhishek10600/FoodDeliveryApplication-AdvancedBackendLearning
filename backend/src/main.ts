import "reflect-metadata";

import "./infrastructure/container/container.js"

import { bootstrap } from "./app/bootstrap.js";
import { createServer } from "./app/server.js";
import { shutdown } from "./app/shutdown.js";
import { container } from "tsyringe";
import { ILogger } from "./shared/logger/logger.interface.js";
import { InfrastructureTokens } from "./infrastructure/container/index.js";

const logger = container.resolve<ILogger>(InfrastructureTokens.Logger)

const start = async(): Promise<void> => {
  try {
    await bootstrap()

    const server = createServer();

    process.on("SIGINT", ()=> shutdown(server, "SIGINT"))
    process.on("SIGTERM", () => shutdown(server, "SIGTERM"))

  } catch (error) {
    logger.error("Process failed to start", error);

    process.exit(1);
  }
}

await start();

process.on("uncaughtException", (error) => {
  logger.error("UncaightException in process", error)

  process.exit(1);
})

process.on("unhandledRejection", (reason) => {
  logger.error("UnhandledRejection in process", reason)

  process.exit(1);
})
