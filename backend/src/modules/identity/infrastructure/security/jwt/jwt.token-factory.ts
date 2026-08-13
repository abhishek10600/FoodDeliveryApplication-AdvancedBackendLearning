import { SignJWT } from "jose"
import { JwtConfig } from "./jwt.types.js";
import { TokenPayload } from "../../../domain/services/token-payload.js";
import { TokenType } from "../../../domain/enums/token-type.enum.js";
import { randomUUID } from "crypto";

export class JwtTokenFactory {
  constructor(private readonly config: JwtConfig) { }

  private getSecret(type: TokenType): Uint8Array {
    const secret = type === TokenType.ACCESS ? this.config.accessTokenSecret : this.config.refreshTokenSecret

    return new TextEncoder().encode(secret)
  }

  private async createToken(payload: {
    sub: string;
    roles?: string[];
    type: TokenType;
  },
    expiresIn: number,
  ): Promise<string> {
    const secret = this.getSecret(payload.type)

    return new SignJWT({
      roles: payload.roles,
      type: payload.type,
    })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT"
    })
    .setJti(randomUUID())
    .setSubject(payload.sub)
    .setIssuer(this.config.issuer)
    .setAudience(this.config.audience)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(secret)
  }


  async createAccessToken(payload: TokenPayload): Promise<string> {
    return this.createToken({
      sub: payload.sub,
      roles: payload.roles,
      type: TokenType.ACCESS
    },
    this.config.accessTokenExpiresIn
    )
  }

  async createRefreshToken(payload: TokenPayload): Promise<string> {
    return this.createToken({
      sub: payload.sub,
      roles: payload.roles,
      type: TokenType.REFRESH
    },
    this.config.refreshTokenExpiresIn
    )
  }
}
