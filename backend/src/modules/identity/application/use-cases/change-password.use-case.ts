import { ChangePasswordInput } from "../dto/change-password.dto.js";

export interface ChangePasswordUseCase {
  execute(input: ChangePasswordInput): Promise<void>
}
