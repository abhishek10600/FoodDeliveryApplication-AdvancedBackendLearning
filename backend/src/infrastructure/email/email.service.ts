export interface EmailService {
  sendVerificationEmail(email: string, verificationUrl: string): Promise<void>
}
