import { z } from "zod"

export const createMenuSchema = z.object({
  name: z.string().trim().min(1, "Menu name cannot be empty").max(100, "Menu name cannot contain more than 100 charactes")
}).strict()

export const createMenuParamSchema = z.object({
  restaurantId: z.uuid()
}).strict()

export type CreateMenuInput = z.infer<typeof createMenuSchema>
export type CreateMenuParamsInput = z.infer<typeof createMenuParamSchema>
