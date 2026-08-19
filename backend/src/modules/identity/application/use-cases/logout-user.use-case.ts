import { LogoutUserInput } from "../dto/logout-user-dto.js";

export interface LogoutUserUseCase {
  execute(input: LogoutUserInput): Promise<void>
}
