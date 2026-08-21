import { ResetPasswordInput } from "../dto/reset-password.dto.js";

export interface ResetPasswordUseCase {
  execute(input: ResetPasswordInput): Promise<void>
}
