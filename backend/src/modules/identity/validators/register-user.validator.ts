import { z } from "zod";

export const registerUserSchema = z.strictObject({
  email: z.email("Invalid email address.").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 charcaters long."),
  firstName: z.string().min(1, "First name cannot be empty").max(100, "First name cannot be more than 100 characters").trim().toLowerCase(),
  lastName: z.string().min(1, "Last name cannot be empty").max(100, "Last name cannot be more than 100 characters").trim().toLowerCase(),
  phone: z.string().max(20, "Phone number cannot contain more than 20 digits").trim()
})

export type RegisterUserRequest = z.infer<typeof registerUserSchema>
