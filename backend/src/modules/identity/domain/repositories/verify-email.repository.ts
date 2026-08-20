import { VerifyEmail } from "../entities/verify-email.entity.js";

export interface IVerifyEmailRepository {
  findByToken(tokenHash: string): Promise<VerifyEmail | null>
  create(verifyEmail: VerifyEmail): Promise<VerifyEmail>
  updateVerifiedAt(id: string, verifiedAt: Date): Promise<void>
}
