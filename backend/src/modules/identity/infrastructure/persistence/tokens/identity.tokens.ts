export const IdentityTokens = {
  UserRepository: Symbol("Identity.UserRepository"),
  RefreshSessionRepository: Symbol("Identity.RefreshSessionRepository"),
  PasswordHasher: Symbol("Identity.PasswordHasher"),
  JwtService: Symbol("Identity.JwtService")
} as const
