export interface EmailService {
  sendVerificationEmail(email: string, verificationUrl: string): Promise<void>

  sendResetPasswordEmail(email: string, resetPasswordUrl: string): Promise<void>
}
