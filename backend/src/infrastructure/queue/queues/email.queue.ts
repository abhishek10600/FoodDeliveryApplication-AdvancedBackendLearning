import { Queue } from "bullmq"
import { redisConnection } from "../../../config/redis.js"
import { EmailJobName, type SendResetPasswordEmailJob, type SendVerificationEmailJob } from "../types/email.job.types.js"

export const emailQueue = new Queue("email", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5_000,
    },

    removeOnComplete: {
      age: 60 * 60,
      count: 1_000
    },

    removeOnFail: {
      age: 24 * 60 * 60,
      count: 5_000
    }

  }
})

export const addVerificationEmailJob = async (data: SendVerificationEmailJob) => {
  return emailQueue.add(EmailJobName.SEND_VERIFICATION_EMAIL,data)
}

export const addResetPasswordEmailJob = async (data: SendResetPasswordEmailJob) => {
  return emailQueue.add(EmailJobName.SEND_RESET_PASSWORD_EMAIL, data)
}
