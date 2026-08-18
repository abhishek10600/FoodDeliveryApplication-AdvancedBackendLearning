import { container } from "tsyringe"
import { IdentityTokens } from "../../../modules/identity/infrastructure/persistence/tokens/index.js"
import { UserRepository } from "../../../modules/identity/infrastructure/persistence/prisma/user.repository.js"
import { RefreshSessionRepository } from "../../../modules/identity/infrastructure/persistence/prisma/refresh-session.repository.js"
import { BcryptPasswordHasher } from "../../../modules/identity/infrastructure/security/bcrypt-password-hasher.js"
import { JwtService } from "../../../modules/identity/infrastructure/security/jwt/jwt.service.js"
import { Sha256TokenHasher } from "../../../modules/identity/infrastructure/security/sha256-token-hasher.js"
import { IdentityTransaction } from "../../../modules/identity/infrastructure/persistence/prisma/identity.transaction.js"
import { RegisterUserUseCaseImpl } from "../../../modules/identity/application/use-cases/register-user.use-case.impl.js"
import { LoginUserUseCaseImpl } from "../../../modules/identity/application/use-cases/login-user.use-case.impl.js"
import { GetCurrentUserUseCaseImpl } from "../../../modules/identity/application/use-cases/get-current-user.use-case.impl.js"
import { AuthorizationService } from "../../../modules/identity/domain/authorization/authorization.service.js"
import { RefreshTokenUseCaseImpl } from "../../../modules/identity/application/use-cases/refresh-token.use-case.impl.js"

export const registerIdentity = (): void => {

  container.register(IdentityTokens.UserRepository, {
    useClass: UserRepository
  })

  container.register(IdentityTokens.RefreshSessionRepository, {
    useClass: RefreshSessionRepository
  })

  container.registerSingleton(IdentityTokens.PasswordHasher, BcryptPasswordHasher)

  container.registerSingleton(IdentityTokens.JwtService, JwtService)

  container.register(IdentityTokens.TokenHasher, {
    useClass: Sha256TokenHasher
  })

  container.register(IdentityTokens.Transaction, {
    useClass: IdentityTransaction
  })

  container.registerSingleton(IdentityTokens.AuthorizationService, AuthorizationService)

  container.registerSingleton(IdentityTokens.RegisterUserUseCase, RegisterUserUseCaseImpl)

  container.registerSingleton(IdentityTokens.LoginUserUseCase, LoginUserUseCaseImpl)

  container.registerSingleton(IdentityTokens.GetCurrentUserUseCase, GetCurrentUserUseCaseImpl)

  container.registerSingleton(IdentityTokens.RefreshTokenUseCase, RefreshTokenUseCaseImpl)
}
