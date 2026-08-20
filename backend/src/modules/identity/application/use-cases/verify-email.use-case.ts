import { VerifyEmailInput } from "../dto/verify-email.dto.js";

export interface VerifyEmailUseCase {
  execute(input: VerifyEmailInput): Promise<void>
}
