import { describe, expect, it } from "vitest";
import { SignJWT } from "jose";

import { JwtService } from "../../../src/modules/identity/infrastructure/security/jwt/jwt.service.js";
import { TokenType } from "../../../src/modules/identity/domain/enums/token-type.enum.js";
import { Role } from "../../../src/modules/identity/domain/enums/role.enum.js";
import { env } from "../../../src/config/env.config.js";

describe("JwtService", () => {
  const jwtService = new JwtService();

  const tokenPayload = {
    sub: "user-123",
    roles: [Role.CUSTOMER],
    type: TokenType.ACCESS,
  };

  describe("Signing", () => {
    it("should create a JWT", async () => {
      const token = await jwtService.signAccessToken(tokenPayload);

      expect(token).toBeTypeOf("string");
      expect(token).not.toBe("");

      const parts = token.split(".");

      expect(parts).toHaveLength(3);
    });
  });

  describe("Verification", () => {
    it("should verify a valid JWT", async () => {
      const token = await jwtService.signAccessToken(tokenPayload);

      const payload = await jwtService.verifyAccessToken(token);

      expect(payload.sub).toBe("user-123");
      expect(payload.roles).toEqual([Role.CUSTOMER]);
      expect(payload.type).toBe(TokenType.ACCESS);

      expect(payload.iat).toBeTypeOf("number");
      expect(payload.exp).toBeTypeOf("number");
      expect(payload.iss).toBe(env.JWT_ISSUER);
      expect(payload.aud).toBe(env.JWT_AUDIENCE);
    });
  });

  describe("Tampering", () => {
    it("should reject a modified JWT", async () => {
      const token = await jwtService.signAccessToken(tokenPayload);

      const [header, , signature] = token.split(".");

      const tamperedPayload = Buffer.from(
        JSON.stringify({
          sub: "attacker-123",
          roles: [Role.ADMIN],
          type: TokenType.ACCESS,
        }),
      ).toString("base64url");

      const tamperedToken =
        `${header}.${tamperedPayload}.${signature}`;

      await expect(
        jwtService.verifyAccessToken(tamperedToken),
      ).rejects.toThrow();
    });
  });

  describe("Expiration", () => {
    it("should reject an expired JWT", async () => {
      const secret = new TextEncoder().encode(
        env.JWT_ACCESS_SECRET,
      );

      const now = Math.floor(Date.now() / 1000);

      const expiredToken = await new SignJWT({
        roles: tokenPayload.roles,
        type: TokenType.ACCESS,
      })
        .setProtectedHeader({
          alg: "HS256",
          typ: "JWT",
        })
        .setSubject(tokenPayload.sub)
        .setIssuer(env.JWT_ISSUER)
        .setAudience(env.JWT_AUDIENCE)
        .setIssuedAt(now - 3600)
        .setExpirationTime(now - 1800)
        .sign(secret);

      await expect(
        jwtService.verifyAccessToken(expiredToken),
      ).rejects.toThrow();
    });
  });

  describe("Signature", () => {
    it("should reject JWT signed with another secret", async () => {
      const anotherSecret = new TextEncoder().encode(
        "another-completely-different-secret",
      );

      const token = await new SignJWT({
        roles: tokenPayload.roles,
        type: TokenType.ACCESS,
      })
        .setProtectedHeader({
          alg: "HS256",
          typ: "JWT",
        })
        .setSubject(tokenPayload.sub)
        .setIssuer(env.JWT_ISSUER)
        .setAudience(env.JWT_AUDIENCE)
        .setIssuedAt()
        .setExpirationTime(
          Math.floor(Date.now() / 1000) + 900,
        )
        .sign(anotherSecret);

      await expect(
        jwtService.verifyAccessToken(token),
      ).rejects.toThrow();
    });
  });

  describe("Issuer", () => {
    it("should reject invalid issuer", async () => {
      const secret = new TextEncoder().encode(
        env.JWT_ACCESS_SECRET,
      );

      const token = await new SignJWT({
        roles: tokenPayload.roles,
        type: TokenType.ACCESS,
      })
        .setProtectedHeader({
          alg: "HS256",
          typ: "JWT",
        })
        .setSubject(tokenPayload.sub)
        .setIssuer("invalid-issuer")
        .setAudience(env.JWT_AUDIENCE)
        .setIssuedAt()
        .setExpirationTime(
          Math.floor(Date.now() / 1000) + 900,
        )
        .sign(secret);

      await expect(
        jwtService.verifyAccessToken(token),
      ).rejects.toThrow();
    });
  });

  describe("Audience", () => {
    it("should reject invalid audience", async () => {
      const secret = new TextEncoder().encode(
        env.JWT_ACCESS_SECRET,
      );

      const token = await new SignJWT({
        roles: tokenPayload.roles,
        type: TokenType.ACCESS,
      })
        .setProtectedHeader({
          alg: "HS256",
          typ: "JWT",
        })
        .setSubject(tokenPayload.sub)
        .setIssuer(env.JWT_ISSUER)
        .setAudience("invalid-audience")
        .setIssuedAt()
        .setExpirationTime(
          Math.floor(Date.now() / 1000) + 900,
        )
        .sign(secret);

      await expect(
        jwtService.verifyAccessToken(token),
      ).rejects.toThrow();
    });
  });
});
