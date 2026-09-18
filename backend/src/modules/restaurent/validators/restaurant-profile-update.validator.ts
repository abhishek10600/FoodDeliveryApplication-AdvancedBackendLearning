import { z } from "zod"

const restaurantAddressSchema = z.strictObject({

  line1: z.string().min(1, "Lin1 cannot be empty").max(200, "Line1 cannot contain more than 200 characters"),
  landMark: z.string().min(1, "landMark cannot be empty").max(200, "landMark cannot contain more than 200 characters"),
  city: z.string().min(1, "City cannot be empty").max(100, "City cannot contain more than 100 characters"),
  state: z.string().min(1, "State cannot be empty").max(100, "State cannot contain more than 100 characters"),
  country: z.string().min(1, "Country cannot be empty").max(100, "Country cannot contain more than 100 characters"),
  postalCode: z.string().min(3, "Postal code must contain atleast 3 characters").max(20, "Postal code cannot contain more than 100 characters")
})

export const restaurantProfileUpdateSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(250, "Name cannot container more than 250 characters").optional(),
  description: z.string().min(1, "Description cannot be empty").max(500, "Description cannot contain more than 500 characters").optional(),
  phone: z.string().min(1, "Phone number cannot be empty").max(20, "Phone number cannot contain more than 20 characters").optional(),
  email: z.email("Email must be in a valid format").trim().toLowerCase().optional(),
  address: restaurantAddressSchema.optional()
}).strict()

export const restaurantProfileUpdateParamsSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant id cannot be empty")
}).strict()

export type restaurantProfileUpdateInput = z.infer<typeof restaurantProfileUpdateSchema>
export type restaurantProfileUpdateParamsSchema = z.infer<typeof restaurantProfileUpdateParamsSchema>
