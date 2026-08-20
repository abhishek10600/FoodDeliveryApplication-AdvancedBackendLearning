import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { env } from "./env.config.js";

export const smtpConfig = {
  host: String(env.SMTP_HOST),
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  password: env.SMTP_PASSWORD,
  from: env.SMTP_FROM
}

export const smtpOptions: SMTPTransport.Options = {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.port === 465,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password
  }
}
