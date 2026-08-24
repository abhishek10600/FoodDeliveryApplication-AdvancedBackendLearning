import "reflect-metadata"
import { registerWorkerDependencies } from "../infrastructure/container/worker-registrations.js";

registerWorkerDependencies()

const { emailWorker } = await import("../infrastructure/queue/workers/email.worker.js")

console.log("Email worker started");

const shutdown = async (signal: string): Promise<void> => {
  console.log(`Received ${signal}. Shutting down email worker...`)

  await emailWorker.close();

  process.exit(0);

}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
})

process.on("SIGINT", () => {
  void shutdown("SIGINT")
})
