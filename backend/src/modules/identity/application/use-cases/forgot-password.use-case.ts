import { ForgotPasswordInput } from "../dto/forgot-password.dto.js";

export interface ForgotPasswordUseCase {
  execute(input: ForgotPasswordInput): Promise<void>
}
