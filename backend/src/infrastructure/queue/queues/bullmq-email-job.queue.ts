import { injectable } from "tsyringe";
import { IEmailJobQueue } from "../../../modules/identity/application/services/email-job-queue.js";
import { emailQueue } from "./email.queue.js";
import { EmailJobName } from "../types/email.job.types.js";

@injectable()
export class BullMQEmailJobQueue implements IEmailJobQueue {

  async enqueueVerificationEmail(data: { userId: string; email: string; verificationUrl: string; }): Promise<void> {
    await emailQueue.add(EmailJobName.SEND_VERIFICATION_EMAIL, data)
  }

  async enqueResetPasswordEmail(data: { userId: string; email: string; resetPasswordUrl: string; }): Promise<void> {
    await emailQueue.add(EmailJobName.SEND_RESET_PASSWORD_EMAIL, data)
  }

}
