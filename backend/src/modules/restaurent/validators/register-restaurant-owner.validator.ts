import { z } from "zod"

export const registerRestaurantOwnerSchema = z.object({
  email: z.email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(1, "Password cannot be empty")
})

export type RegisterRestaurantOwnerRequest = z.infer<typeof registerRestaurantOwnerSchema>
