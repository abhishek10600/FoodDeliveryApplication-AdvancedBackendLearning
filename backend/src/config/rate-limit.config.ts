import { env } from "./env.config.js";

export const RateLimitPolicies = {

  Global: {
    windowMs: env.GLOBAL_RATE_LIMIT_WINDOW * 60 * 1000,
    max: env.GLOBAL_RATE_LIMIT_MAX
  },

  Login: {
    windowMs: env.LOGIN_USER_RATE_LIMIT_WINDOW * 60 * 1000,
    max: env.LOGIN_USER_RATE_LIMIT_MAX
  },

  Register: {
    windowMs: env.REGISTER_USER_RATE_LIMIT_WINDOW * 60 * 1000,
    max: env.REGISTER_USER_RATE_LIMIT_MAX
  },

  ForgotPassword: {
    windowMs: env.FORGOT_PASSWORD_RATE_LIMIT_WINDOW * 60 * 1000,
    max: env.FORGOT_PASSWORD_RATE_LIMIT_MAX
  },

  ResetPassword: {
    windowMs: env.RESET_PASSWORD_RATE_LIMIT_WINDOW * 60 * 1000,
    max: env.FORGOT_PASSWORD_RATE_LIMIT_MAX
  },

  RefreshToken: {
    windowMs: env.REFRESH_TOKEN_RATE_LIMIT_WINDOW * 60 * 1000,
    max: env.REFRESH_TOKEN_RATE_LIMIT_MAX
  },

  VerifyEmail: {
    windowMs: env.VERIFY_EMAIL_RATE_LIMIT_WINDOW * 60 * 1000,
    max: env.VERIFY_EMAIL_RATE_LIMIT_MAX
  }
} as const
