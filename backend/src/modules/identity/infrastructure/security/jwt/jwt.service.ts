import { injectable } from "tsyringe";
import { IJWTService } from "../../../domain/services/jwt.service.js";
import { JwtTokenFactory } from "./jwt.token-factory.js";
import { JWTTokenVerifier } from "./jwt.token-verifier.js";
import { env } from "../../../../../config/env.config.js";
import { JwtConfig } from "./jwt.types.js";
import { TokenPayload } from "../../../domain/services/token-payload.js";

@injectable()
export class JwtService implements IJWTService {

  private readonly tokenFactory: JwtTokenFactory;
  private readonly tokenVerifier: JWTTokenVerifier;

  constructor() {
    const config: JwtConfig = {
      accessTokenSecret: env.JWT_ACCESS_SECRET,
      refreshTokenSecret: env.JWT_REFRESH_SECRET,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      accessTokenExpiresIn: Number(env.JWT_ACCESS_EXPIRES_IN ?? 900),
      refreshTokenExpiresIn: Number(env.JWT_REFRESH_EXPIRES_IN ?? 604800)
    }

    this.tokenFactory = new JwtTokenFactory(config);
    this.tokenVerifier = new JWTTokenVerifier(config)
  }

  async signAccessToken(tokenPayload: TokenPayload): Promise<string> {
    return this.tokenFactory.createAccessToken(tokenPayload)
  }

  async signRefreshToken(tokenPayload: TokenPayload): Promise<string> {
    return this.tokenFactory.createRefreshToken(tokenPayload)
  }

  async verifyAccessToken(accessToken: string): Promise<TokenPayload> {
    return this.tokenVerifier.verifyAccessToken(accessToken)
  }

  async verifyRefreshToken(refreshToken: string): Promise<TokenPayload> {
    return this.tokenVerifier.verifyRefreshToken(refreshToken)
  }
}
