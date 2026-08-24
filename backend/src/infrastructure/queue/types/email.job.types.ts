export const EmailJobName =  {
  SEND_VERIFICATION_EMAIL: "send-verification-email",
  SEND_RESET_PASSWORD_EMAIL: "send-reset-password-email"
} as const ;

export type EmailJobName = typeof EmailJobName[keyof typeof EmailJobName]

export interface SendVerificationEmailJob {
  userId: string;
  email: string;
  verificationUrl: string;
}

export interface SendResetPasswordEmailJob {
  userId: string;
  email: string;
  resetPasswordUrl: string;
}
