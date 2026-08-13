import { container } from "tsyringe"
import { IdentityTokens } from "../../../modules/identity/infrastructure/persistence/tokens/index.js"
import { UserRepository } from "../../../modules/identity/infrastructure/persistence/prisma/user.repository.js"
import { RefreshSessionRepository } from "../../../modules/identity/infrastructure/persistence/prisma/refresh-session.repository.js"

export const registerIdentity = (): void => {

  container.register(IdentityTokens.UserRepository, {
    useClass: UserRepository
  })

  container.register(IdentityTokens.RefreshSessionRepository, {
    useClass: RefreshSessionRepository
  })

}
