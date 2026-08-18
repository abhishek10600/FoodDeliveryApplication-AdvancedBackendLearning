import { RefreshTokenResult } from "../dto/refresh-token-result.dto.js";
import { RefreshTokenInput } from "../dto/refresh-token.dto.js";

export interface RefreshTokenUseCase {
  execute(input: RefreshTokenInput): Promise<RefreshTokenResult>
}
