export const IdentityTokens = {
  UserRepository: Symbol.for("Identity.UserRepository"),
  RefreshSessionRepository: Symbol.for("Identity.RefreshSessionRepository"),
  VerifyEmailRepository: Symbol.for("IdentityTokens.VerifyEmailRepository"),
  PasswordHasher: Symbol.for("Identity.PasswordHasher"),
  JwtService: Symbol.for("Identity.JwtService"),
  TokenHasher: Symbol.for("Identity.TokenHasher"),
  Transaction: Symbol.for("Identity.Transaction"),
  AuthorizationService: Symbol.for("Identity.AuthorizationService"),
  RegisterUserUseCase: Symbol.for("Identity.RegisterUserUseCase"),
  LoginUserUseCase: Symbol.for("Identity.LoginUserUseCase"),
  GetCurrentUserUseCase: Symbol.for("Identity.GetCurrentUserUseCase"),
  RefreshTokenUseCase: Symbol.for("Identity.RefreshTokenUseCase"),
  LogoutUserUseCase: Symbol.for("Identity.LogoutUserUseCase"),
  ChangePasswordUseCase: Symbol.for("Identity.ChangePasswordUseCase"),
  VerifyEmailUseCase: Symbol.for("Identity.VerifyEmail")
} as const
