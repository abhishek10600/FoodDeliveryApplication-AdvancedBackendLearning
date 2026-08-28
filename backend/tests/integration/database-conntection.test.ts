import {
  describe,
  expect,
  it,
  afterAll,
  beforeAll,
} from "vitest";

import { PrismaClient } from "../../generated/prisma/client.js";

import { createTestPrisma } from "../helpers/test-prisma.js";

describe("Test PostgreSQL", () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = createTestPrisma();

    await prisma.$connect();
  });

  it("should connect to the test database", async () => {
    const result =
      await prisma.$queryRaw<
        Array<{ result: number }>
      >`SELECT 1 AS result`;

    expect(result[0]?.result).toBe(1);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
