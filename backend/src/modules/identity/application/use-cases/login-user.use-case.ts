import { LoginUserResult } from "../dto/login-user-result.dto.js";
import { LoginUserInput } from "../dto/login-user.dto.js";

export interface LoginUserUseCase {
  execute(input: LoginUserInput): Promise<LoginUserResult>
}
