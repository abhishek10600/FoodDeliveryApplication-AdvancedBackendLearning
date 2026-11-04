import { z } from "zod"

export const addressUpdateSchema = z.object({
  houseName: z.string().trim().min(1, "House name cannot be empty").max(100, "House name cannot contain more than 100 characters").optional(),

  streetName: z.string().trim().min(1, "Street name cannot be empty").max(100, "Street name cannot contain more than 100 characters").optional(),

  landMark: z.string().trim().min(1, "Land mark cannot be empty").max(100, "Land mark cannot contain more than 100 characters").optional(),

  city: z.string().trim().min(1, "City cannot be empty").max(100, "City cannot contain more than 100 characters").optional(),

  state: z.string().trim().min(1, "State cannot be empty").max(100, "State cannot contain more than 100 characters").optional(),

  country: z.string().trim().min(1, "Country cannot be empty").max(100, "Country cannot contain more than 100 characters").optional(),

  pin: z.string().trim().min(4, "Pin must contain at least 4 characters").max(100, "Pin cannot contain more than 100 characters").optional()
}).strict()

export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>
