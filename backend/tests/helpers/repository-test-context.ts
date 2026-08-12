import { getPrismaClient } from "./test.database"
import { UserRepository } from "../../src/modules/identity/infrastructure/persistence/prisma/user.repository"
import { RefreshSessionRepository } from "../../src/modules/identity/infrastructure/persistence/prisma/refresh-session.repository"

export const createRepositoryTestContext = () => {
  const prisma = getPrismaClient()

  const userRepository = new UserRepository(prisma)
  const refreshSessionRepository = new RefreshSessionRepository(prisma)

  return {
    prisma, userRepository, refreshSessionRepository
  }

}
