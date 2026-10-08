import { z } from "zod"

export const menuByIdParamSchema = z.object({
  menuId: z.uuid()
}).strict()

export type MenuByIdParamInput =  z.infer<typeof menuByIdParamSchema>
