import "reflect-metadata";

// import { container } from "tsyringe";

import { registerDependencies } from "./infrastructure/container/registrations.js";
// import { InfrastructureTokens } from "./infrastructure/container/tokens/infrastructure.tokens.js";
// import type { ILogger } from "./shared/logger/logger.interface.js";

registerDependencies();

// const logger = container.resolve<ILogger>(
//   InfrastructureTokens.Logger
// );

process.on("uncaughtException", (error) => {
  // logger.error("UncaughtException in process", error);
  console.error("UncaughtException in process:", error);

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  // logger.error("UnhandledRejection in process", reason);
  console.error("UnhandledRejection in process:", reason);

  process.exit(1);
});

const start = async (): Promise<void> => {
  try {
    const { bootstrap } = await import("./app/bootstrap.js");
    const { createServer } = await import("./app/server.js");
    const { shutdown } = await import("./app/shutdown.js");

    await bootstrap();

    const server = createServer();

    process.on("SIGINT", () => {
      shutdown(server, "SIGINT");
    });

    process.on("SIGTERM", () => {
      shutdown(server, "SIGTERM");
    });
  } catch (error) {
    console.error("Process failed to start:", error);
    // logger.error("Process failed to start", error);

    process.exit(1);
  }
};

await start();
