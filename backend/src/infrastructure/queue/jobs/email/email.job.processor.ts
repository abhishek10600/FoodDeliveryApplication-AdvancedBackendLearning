import { injectable, inject } from "tsyringe"
import { InfrastructureTokens } from "../../../container/index.js";
import type { EmailService } from "../../../email/email.service.js";
import { Job } from "bullmq";
import { EmailJobName, SendResetPasswordEmailJob, SendVerificationEmailJob } from "../../types/email.job.types.js";

@injectable()
export class EmailJobProcessor {

  constructor(

    @inject(InfrastructureTokens.EmailService)
    private readonly emailService: EmailService

  ) { }

  async process(job: Job): Promise<void> {

    switch (job.name) {

      case EmailJobName.SEND_VERIFICATION_EMAIL: {
        const data = job.data as SendVerificationEmailJob;

        await this.emailService.sendVerificationEmail(data.email, data.verificationUrl);

        return;
      }

      case EmailJobName.SEND_RESET_PASSWORD_EMAIL: {
        const data = job.data as SendResetPasswordEmailJob;

        await this.emailService.sendResetPasswordEmail(data.email, data.resetPasswordUrl)

        return;
      }

      default:
        throw new Error(`Unsupported email job: ${job.name}`)

    }

  }

}
