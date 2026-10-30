import { z } from "zod"

export const driverProfileUpdateSchema = z.object({
  firstName: z.string().trim().min(1, "Driver first name cannot be empty").max(100, "Driver first name cannot contain more than 100 characters").optional(),

  lastName: z.string().trim().min(1, "Driver last name cannot be empty").max(100, "Driver last name cannot contain more than 100 characters").optional(),

  phone: z.string().trim().min(10, "Driver phone number must contain at least 10 characters").max(15, "Driver phone number cannot contain more than 15 digits").optional()
}).strict()

export type DriverProfileUpdateInput = z.infer<typeof driverProfileUpdateSchema>
