import { z } from "zod"

export const registerDriverSchema = z.object({
  firstName: z.string().trim().min(1, "driver first name cannot be empty").max(100, "driver first name cannot contain more than 100 characters"),

  lastName: z.string().trim().min(1, "driver last name cannot be empty").max(100, "driver last name cannot contain more than 100 characters"),

  phone: z.string().trim().min(10, "driver phone must contain at least 10 characters").max(20, "driver phone cannot contain more than 20 characters"),

  email: z.email(),

  password: z.string().min(6, "password must contain at least 6 characters"),

  vehicleType: z.enum(["bicycle", "motorbike", "scooter", "car"]),

  vehicleRegNo: z.string().trim().min(1, "vehicle registration number cannot be empty"),

  vehicleModel: z.string().trim().min(2, "vehicle model must contain at least 2 characters"),

  vehicleColor: z.string().trim().min(1, "vehicle color cannot be empty"),

  vehicleMake: z.string().trim().min(1, "vehicle make cannot be empty")
}).strict()

export type RegisterDriverInput = z.infer<typeof registerDriverSchema>
