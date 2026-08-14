import { RegisterUserResult } from "../dto/register-user-result.dto.js";
import { RegisterUserInput } from "../dto/register-user.dto.js";

export interface RegisterUserUseCase {
  execute(input: RegisterUserInput): Promise<RegisterUserResult>
}
