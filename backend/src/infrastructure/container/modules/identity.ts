import { container } from "tsyringe"
import { IdentityTokens } from "../../../modules/identity/infrastructure/persistence/tokens/index.js"
import { UserRepository } from "../../../modules/identity/infrastructure/persistence/prisma/user.repository.js"
import { RefreshSessionRepository } from "../../../modules/identity/infrastructure/persistence/prisma/refresh-session.repository.js"
import { BcryptPasswordHasher } from "../../../modules/identity/infrastructure/security/bcrypt-password-hasher.js"
import { JwtService } from "../../../modules/identity/infrastructure/security/jwt/jwt.service.js"

export const registerIdentity = (): void => {

  container.register(IdentityTokens.UserRepository, {
    useClass: UserRepository
  })

  container.register(IdentityTokens.RefreshSessionRepository, {
    useClass: RefreshSessionRepository
  })

  container.registerSingleton(IdentityTokens.PasswordHasher, BcryptPasswordHasher)

  container.registerSingleton(IdentityTokens.JwtService, JwtService)

}
