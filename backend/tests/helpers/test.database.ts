import { PrismaClient } from "../../generated/prisma/client"

let prisma: PrismaClient | null = null

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient()
  }

  return prisma
}


export const connectTestDatabase = async() => {
  const client = getPrismaClient()

  await client.$connect()

  return client
}

export const disconnectTestDatabase = async () => {
  if (!prisma) {
    return null
  }

  await prisma.$disconnect()

  return prisma;
}

export const cleanTestDatabase = async(): Promise<void> => {
  const client = getPrismaClient()

  await client.$transaction([
    client.passwordReset.deleteMany(),
    client.emailVerification.deleteMany(),
    client.refreshSession.deleteMany(),
    client.user.deleteMany()
  ])
}
