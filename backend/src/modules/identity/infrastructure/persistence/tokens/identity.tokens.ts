export const IdentityTokens = {
  UserRepository: Symbol.for("Identity.UserRepository"),
  RefreshSessionRepository: Symbol.for("Identity.RefreshSessionRepository"),
  PasswordHasher: Symbol.for("Identity.PasswordHasher"),
  JwtService: Symbol.for("Identity.JwtService"),
  TokenHasher: Symbol.for("Identity.TokenHasher"),
  Transaction: Symbol.for("Identity.Transaction"),
  RegisterUserUseCase: Symbol.for("Identity.RegisterUserUseCase"),
  LoginUserUseCase: Symbol.for("Identity.LoginUserUseCase"),
  GetCurrentUserUseCase: Symbol.for("Identity.GetCurrentUserUseCase")
} as const
