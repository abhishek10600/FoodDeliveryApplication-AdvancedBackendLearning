import { JWTPayload, jwtVerify,  } from "jose";
import { TokenPayload } from "../../../domain/services/token-payload.js";
import { JwtClaims, JwtConfig } from "./jwt.types.js";
import { TokenType } from "../../../domain/enums/token-type.enum.js";
import { AuthenticationError } from "../../../../../shared/errors/AuthenticationError.js";
import { JOSEError } from "jose/errors";

export class JWTTokenVerifier {
  constructor(private readonly config: JwtConfig) { }

  private getSecret(type: TokenType): Uint8Array {
    const secret = type === TokenType.ACCESS ? this.config.accessTokenSecret : this.config.refreshTokenSecret

    return new TextEncoder().encode(secret)
  }

  private validateClaims(payload: JWTPayload): JwtClaims {
    if (!payload.sub) {
      throw new AuthenticationError("JWT subject missing")
    }

    if (payload.type !== TokenType.ACCESS && payload.type !== TokenType.REFRESH) {
      throw new AuthenticationError("Invalid JWT token type")
    }

    const roles = payload.roles;

    if (roles !== undefined && (!Array.isArray(roles) || !roles.every((role): role is string => typeof role === "string"))) {
      throw new AuthenticationError("Invalid JWT roles claim")
    }

    return {
      sub: payload.sub,
      roles,
      type: payload.type,
      iat: payload.iat,
      exp: payload.exp,
      iss: typeof payload.iss === "string" ? payload.iss : undefined,
      aud: typeof payload.aud === "string" ? payload.aud : undefined
    }
  }

  private async verify(token: string, expectedType: TokenType): Promise<JwtClaims> {
    try {
      const secret = this.getSecret(expectedType)

      const { payload } = await jwtVerify(token, secret, {
        issuer: this.config.issuer,
        audience: this.config.audience,
        algorithms: ["HS256"]
      })

      return this.validateClaims(payload)
    } catch (error) {
      if (error instanceof JOSEError) {
        throw new AuthenticationError("Invalid or expired access token")
      }

      if (error instanceof AuthenticationError) {
        throw error
      }

      throw error
    }
  }

  private toTokenPayload(payload: JwtClaims): TokenPayload {

    return {
      sub: payload.sub,
      roles: payload.roles as TokenPayload["roles"] ?? [],
      type: payload.type,
      iat: payload.iat,
      exp: payload.exp,
      iss: payload.iss,
      aud: payload.aud
    }
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    const payload = await this.verify(token, TokenType.ACCESS)

    if (payload.type !== TokenType.ACCESS) {
      throw new AuthenticationError("Invalid JWT token type")
    }

    return this.toTokenPayload(payload)
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    const payload = await this.verify(token, TokenType.REFRESH)

    if (payload.type !== TokenType.REFRESH) {
      throw new AuthenticationError("Invalid JWT token type")
    }

    return this.toTokenPayload(payload)
  }
}
