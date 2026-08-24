import { ResetPasswordEntity } from "../entities/reset-password.entity.js";

export interface IPasswordResetRepository {

  create(resetPassword: ResetPasswordEntity): Promise<ResetPasswordEntity>

  findByTokenHash(tokenHash: string): Promise<ResetPasswordEntity | null>

  update(resetPassword: ResetPasswordEntity): Promise<ResetPasswordEntity>

}
