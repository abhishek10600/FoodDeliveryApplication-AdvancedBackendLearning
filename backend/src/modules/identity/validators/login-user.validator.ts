import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email("Invalid email address.").trim().toLowerCase(),
  password: z.string()
}).strict()

export type LoginUserRequest = z.infer<typeof loginUserSchema>
