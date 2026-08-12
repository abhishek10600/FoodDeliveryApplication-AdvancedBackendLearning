import { describe, expect, it, afterAll, beforeAll } from "vitest"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js"
import { env } from "../../src/config/env.config.js"

const connectionString = `${env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

const prisma = new PrismaClient({adapter})

describe("Test Postgresql", () => {
  it("should connect to the test database", async () => {
    const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 AS result`;

    expect(result[0]?.result).toBe(1);
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })
})
