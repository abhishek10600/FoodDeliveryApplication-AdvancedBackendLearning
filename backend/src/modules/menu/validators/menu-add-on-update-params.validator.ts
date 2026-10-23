import { z } from "zod"

export const menuAddOnUpdateParamsSchema = z.object({
  id: z.uuid(),
  menuAddOnGroupId: z.uuid()
}).strict()
