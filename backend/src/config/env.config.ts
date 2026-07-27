import dotenv from "dotenv"
dotenv.config({
  path: "./.env"
})
import { z } from "zod"
import { envSchema } from "./env.schema.js"


const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error("Invalid environment variables: ", z.treeifyError(parsedEnv.error))

  process.exit(1);
}

export const env = parsedEnv.data
