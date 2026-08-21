import { z } from "zod"

export const resetPasswordParamSchema = z.object({
  token: z.string()
})

export const resetPasswordBodySchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters long.")
})
