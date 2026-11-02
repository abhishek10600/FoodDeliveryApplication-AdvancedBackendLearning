import { z } from "zod"

export const createAddressSchema = z.object({
  houseName: z.string().trim().min(1, "house name cannot be empty").max(100, "house name cannot contain more than 100 characters"),

  streetName: z.string().trim().min(1, "street name cannot be empty").max(100, "street name cannot contain more than 100 characters"),

  landMark: z.string().trim().min(1, "landmark cannot be empty").max(100, "landmark cannot contain more than 100 characters").optional(),

  city: z.string().trim().min(1, "city cannot be empty").max(100, "city cannot contain more than 100 characters"),

  state: z.string().trim().min(1, "state cannot be empty").max(100, "state cannot contain more than 100 characters"),

  country: z.string().trim().min(1, "country cannot be empty").max(100, "country cannot contain more than 100 characters"),

  pin: z.string().trim().min(4, "pin must contain at least 5 characters").max(100, "pin cannot contain more than 100 characters"),
}).strict()

export type CreateAddressInput = z.infer<typeof createAddressSchema>
