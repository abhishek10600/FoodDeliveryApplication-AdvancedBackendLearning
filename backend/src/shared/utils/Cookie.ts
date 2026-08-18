import { Response } from "express";
import { env } from "../../config/env.config.js";

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {

  const refreshTokenMaxAge = env.JWT_REFRESH_EXPIRES_IN * 1000;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshTokenMaxAge
  })
}
