import "reflect-metadata";

import "./infrastructure/container/container.js"

import { bootstrap } from "./app/bootstrap.js";
import { createServer } from "./app/server.js";
import { shutdown } from "./app/shutdown.js";
import { logger } from "./config/logger.js";

const start = async(): Promise<void> => {
  try {
    await bootstrap()

    const server = createServer();

    process.on("SIGINT", ()=> shutdown(server, "SIGINT"))
    process.on("SIGTERM", () => shutdown(server, "SIGTERM"))

  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}

await start();

process.on("uncaughtException", (error) => {
  logger.error(error)

  process.exit(1);
})

process.on("unhandledRejection", (reason) => {
  logger.error(reason)

  process.exit(1);
})
