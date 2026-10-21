import { z } from "zod"

export const menuAddOnGroupByIdParamsSchema = z.object({
  menuAddOnGroupId: z.uuid()
}).strict()

export type MenuAddOnGroupByIdInput = z.infer<typeof menuAddOnGroupByIdParamsSchema>
