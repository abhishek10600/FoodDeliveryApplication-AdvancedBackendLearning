export interface IEmailJobQueue {
  enqueueVerificationEmail(data: {
    userId: string;
    email: string;
    verificationUrl: string;
  }): Promise<void>;

  enqueResetPasswordEmail(data: {
    userId: string;
    email: string;
    resetPasswordUrl: string;
  }): Promise<void>
}
