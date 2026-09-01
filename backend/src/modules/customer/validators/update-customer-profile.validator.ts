import { z } from "zod"

export const updateCustomerProfileSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty").max(100, "First name cannot contain more than 100 characters").optional(),

  lastName: z.string().min(1, "Last name cannot be empty").max(100, "Last name cannot contain more than 100 characters").optional(),

  phone: z.string().min(1, "Phone number cannot be empty").max(20, "Phone number cannot contain more than 100 characters").optional()
})

export type UpdateCustomerProfileRequest = z.infer<typeof updateCustomerProfileSchema>
