import { TokenType } from "../../../domain/enums/token-type.enum.js";

export interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  // secret: string;
  issuer: string;
  audience: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface JwtClaims {
  sub: string;
  roles?: string[];
  type: TokenType;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}
