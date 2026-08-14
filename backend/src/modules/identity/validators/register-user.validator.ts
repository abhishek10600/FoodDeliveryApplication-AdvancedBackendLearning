import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email("Invalid email address.").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 charcaters long.")
})

export type RegisterUserRequest = z.infer<typeof registerUserSchema>
