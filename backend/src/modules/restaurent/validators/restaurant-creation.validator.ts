import { z } from "zod"

const restaurantAddressSchema = z.strictObject({

  line1: z.string().min(1, "Lin1 cannot be empty").max(200, "Line1 cannot contain more than 200 characters"),
  landMark: z.string().min(1, "landMark cannot be empty").max(200, "landMark cannot contain more than 200 characters"),
  city: z.string().min(1, "City cannot be empty").max(100, "City cannot contain more than 100 characters"),
  state: z.string().min(1, "State cannot be empty").max(100, "State cannot contain more than 100 characters"),
  country: z.string().min(1, "Country cannot be empty").max(100, "Country cannot contain more than 100 characters"),
  postalCode: z.string().min(3, "Postal code must contain atleast 3 characters").max(20, "Postal code cannot contain more than 100 characters")
})

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format")

const openingHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  opensAt: timeSchema.nullable(),
  closesAt: timeSchema.nullable(),
  isClosed: z.boolean()
})

export const createRestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name cannot be empty").max(100, "Restaurant name cannot contain more than 100 characters"),
  description: z.string().min(1, "Restaurant description cannot be empty").max(500, "Restaurant description cannot contain more than 500 characters"),
  phone: z.string().min(1, "Phone cannot be empty").max(20, "Phone number cannot contain more than 20 digits"),
  email: z.email("Invalid email format").trim().toLowerCase(),
  address: restaurantAddressSchema,
  cuisineIds: z.array(z.uuid()).max(20).default([]),
  openingHours: z.array(openingHoursSchema),
})

export type CreateRestaurantRequest = z.infer<typeof createRestaurantSchema>
