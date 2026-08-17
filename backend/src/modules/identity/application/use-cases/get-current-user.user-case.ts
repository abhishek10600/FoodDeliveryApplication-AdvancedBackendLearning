import { GetCurrentUserResult } from "../dto/get-current-user-result.dto.js";

export interface GetCurrentUserUseCase {
  execute(userId: string): Promise<GetCurrentUserResult>
}
