import { TokenPayload } from "./token-payload.js";

export interface IJWTService {
  signAccessToken(tokenPayload: TokenPayload): Promise<string>

  signRefreshToken(tokenPayload: TokenPayload): Promise<string>

  verifyAccessToken(accessToken: string): Promise<TokenPayload>

  verifyRefreshToken(refreshToken: string): Promise<TokenPayload>
}
