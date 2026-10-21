import { z } from "zod"

export const updateMenuAddOnGroupParamsSchema = z.object({
  menuAddOnGroupId: z.uuid(),
  menuItemId: z.uuid()
}).strict()

export type UpdateMenuAddOnGroupParamsInput = z.infer<typeof updateMenuAddOnGroupParamsSchema>
