import { describe, expect, it } from "vitest";
import { SignJWT, jwtVerify } from "jose";

import { TokenType } from "../../../src/modules/identity/domain/enums/token-type.enum.js";
import { env } from "../../../src/config/env.config.js";

describe("JWT Token Secrets", () => {
  const userId = "user-123";

  const createToken = async (
    type: TokenType,
    secret: string,
  ): Promise<string> => {
    const encodedSecret = new TextEncoder().encode(secret);

    return new SignJWT({
      type,
    })
      .setProtectedHeader({
        alg: "HS256",
        typ: "JWT",
      })
      .setSubject(userId)
      .setIssuer(env.JWT_ISSUER)
      .setAudience(env.JWT_AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(
        Math.floor(Date.now() / 1000) + 900,
      )
      .sign(encodedSecret);
  };

  it("should reject access token signed with refresh secret", async () => {
    const accessToken = await createToken(
      TokenType.ACCESS,
      env.JWT_ACCESS_SECRET,
    );

    const refreshSecret = new TextEncoder().encode(
      env.JWT_REFRESH_SECRET,
    );

    await expect(
      jwtVerify(accessToken, refreshSecret, {
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
        algorithms: ["HS256"],
      }),
    ).rejects.toThrow();
  });

  it("should reject refresh token signed with access secret", async () => {
    const refreshToken = await createToken(
      TokenType.REFRESH,
      env.JWT_REFRESH_SECRET,
    );

    const accessSecret = new TextEncoder().encode(
      env.JWT_ACCESS_SECRET,
    );

    await expect(
      jwtVerify(refreshToken, accessSecret, {
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
        algorithms: ["HS256"],
      }),
    ).rejects.toThrow();
  });
});
