import { container } from "tsyringe";
import { Job, Worker } from "bullmq";
import { InfrastructureTokens } from "../../container/tokens/infrastructure.tokens.js";
import { EmailJobProcessor } from "../jobs/email/email.job.processor.js";
import { redisConnection } from "../../../config/redis.js";

const emailJobProcessor = container.resolve<EmailJobProcessor>(InfrastructureTokens.EmailJobProcessor)

export const emailWorker = new Worker(
  "email",
  async (job: Job) => {
  await emailJobProcessor.process(job)
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
)

emailWorker.on("completed", (job) => {
  console.log(`Email job completed: ${job.id}`)
})

emailWorker.on("failed", (job, error) => {
  console.error(`Email job failed: ${job?.id}`, error);
});

emailWorker.on("error", (error) => {
  console.error("Email worker error", error);
});
