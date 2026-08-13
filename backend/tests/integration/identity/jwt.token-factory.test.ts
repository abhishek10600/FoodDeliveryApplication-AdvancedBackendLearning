import { describe, expect, it } from "vitest";
import { jwtVerify } from "jose";

import { JwtTokenFactory } from "../../../src/modules/identity/infrastructure/security/jwt/jwt.token-factory.js";
import { TokenType } from "../../../src/modules/identity/domain/enums/token-type.enum.js";
import { Role } from "../../../src/modules/identity/domain/enums/role.enum.js";
import { env } from "../../../src/config/env.config.js";
import type { JwtConfig } from "../../../src/modules/identity/infrastructure/security/jwt/jwt.types.js";

describe("JwtTokenFactory", () => {
  const config: JwtConfig = {
    accessTokenSecret: env.JWT_ACCESS_SECRET,
    refreshTokenSecret: env.JWT_REFRESH_SECRET,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    accessTokenExpiresIn: Number(env.JWT_ACCESS_EXPIRES_IN ?? 900),
    refreshTokenExpiresIn: Number(
      env.JWT_REFRESH_EXPIRES_IN ?? 604800,
    ),
  };

  const tokenFactory = new JwtTokenFactory(config);

  const userId = "user-123";

  const roles = [Role.CUSTOMER];

  it("should create access token", async () => {
    const token = await tokenFactory.createAccessToken({
      sub: userId,
      roles,
      type: TokenType.ACCESS,
    });

    expect(token).toBeTypeOf("string");

    const secret = new TextEncoder().encode(
      config.accessTokenSecret,
    );

    const { payload } = await jwtVerify(token, secret, {
      issuer: config.issuer,
      audience: config.audience,
      algorithms: ["HS256"],
    });

    expect(payload.type).toBe(TokenType.ACCESS);
    expect(payload.sub).toBe(userId);
  });

  it("should create refresh token", async () => {
    const token = await tokenFactory.createRefreshToken({
      sub: userId,
      roles,
      type: TokenType.REFRESH,
    });

    expect(token).toBeTypeOf("string");

    const secret = new TextEncoder().encode(
      config.refreshTokenSecret,
    );

    const { payload } = await jwtVerify(token, secret, {
      issuer: config.issuer,
      audience: config.audience,
      algorithms: ["HS256"],
    });

    expect(payload.type).toBe(TokenType.REFRESH);
    expect(payload.jti).toBeDefined();
    expect(payload.jti).not.toBe("");
  });
});
