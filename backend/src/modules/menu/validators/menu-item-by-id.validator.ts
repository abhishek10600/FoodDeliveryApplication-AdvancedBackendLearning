import { z } from "zod"

export const menuItemByIdParamsSchema = z.object({
  id: z.uuid()
}).strict()

export type MenuItemByIdParamsInput = z.infer<typeof menuItemByIdParamsSchema>
