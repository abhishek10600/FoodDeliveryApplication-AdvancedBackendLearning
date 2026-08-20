import { z } from "zod";

export const verifyEmailSchema = z.object({
  token: z.string()
})

export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>
