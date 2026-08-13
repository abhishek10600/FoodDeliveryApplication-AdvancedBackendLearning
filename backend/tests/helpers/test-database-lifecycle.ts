import { beforeAll, afterAll } from "vitest"
import { connectTestDatabase, disconnectTestDatabase } from "./test.database"

export const setupTestDatabase = (): void => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })
}
