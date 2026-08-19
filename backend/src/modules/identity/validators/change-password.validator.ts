import { z } from "zod"

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, "Password must be at least 6 characters long.")
})

export type ChangePasswordType = z.infer<typeof changePasswordSchema>
