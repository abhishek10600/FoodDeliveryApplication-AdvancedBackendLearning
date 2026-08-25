import type { RequestHandler } from "express";
import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../../../../infrastructure/container/index.js";
import { RateLimitService } from "../../../../infrastructure/security/rate-limit.service.js";
import { RateLimitPolicies } from "../../../../config/rate-limit.config.js";

@injectable()
export class IdentityRateLimitMiddleware {

  readonly login: RequestHandler
  readonly register: RequestHandler
  readonly forgotPassword: RequestHandler
  readonly resetPassword: RequestHandler
  readonly refreshToken: RequestHandler
  readonly verifyEmail: RequestHandler

  constructor(

    @inject(InfrastructureTokens.RateLimitService)
    private readonly rateLimitService: RateLimitService

  ) {

    this.login = this.rateLimitService.createLimiter(RateLimitPolicies.Login, "identity-login")

    this.register = this.rateLimitService.createLimiter(RateLimitPolicies.Register, "identity-register")

    this.forgotPassword = this.rateLimitService.createLimiter(RateLimitPolicies.ForgotPassword, "identity-forgot-password")

    this.resetPassword = this.rateLimitService.createLimiter(RateLimitPolicies.ResetPassword, "identity-reset-password")

    this.refreshToken = this.rateLimitService.createLimiter(RateLimitPolicies.RefreshToken, "identity-refresh-token")

    this.verifyEmail = this.rateLimitService.createLimiter(RateLimitPolicies.VerifyEmail, "identity-verify-email")

  }

}
