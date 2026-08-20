import { injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer"
import { EmailService } from "./email.service.js";
import { smtpConfig, smtpOptions } from "../../config/smtp.config.js";

@injectable()
export class SmtpService implements EmailService {

  private readonly transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport(smtpOptions)
  }

  async sendVerificationEmail(email: string, verificationUrl: string): Promise<void> {
    await this.transporter.sendMail({
      from: smtpConfig.from,
      to: email,
      subject: "[ACTION REQUIRED] Please Verify Your Email",
      text: `Verify you FoodFlow account by clicking on this link: ${verificationUrl}`,
      html: `
      <div>
                <h1>Welcome to FoodFlow</h1>

                <p>
                  Thanks for creating your FoodFlow account.
                </p>

                <p>
                  Please verify your email address by clicking the button below.
                </p>

                <a
                  href="${verificationUrl}"
                  style="
                    display:inline-block;
                    padding:12px 20px;
                    background:#000;
                    color:#fff;
                    text-decoration:none;
                    border-radius:6px;
                  "
                >
                  Verify Email
                </a>

                <p>
                  This verification link will expire soon.
                </p>
              </div>
      `
    })
  }

}
