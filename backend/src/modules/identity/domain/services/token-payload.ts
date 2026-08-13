import { Role } from "../enums/index.js";
import { TokenType } from "../enums/token-type.enum.js";

export interface TokenPayload {
  sub: string;
  roles: Role[];
  type: TokenType;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}
