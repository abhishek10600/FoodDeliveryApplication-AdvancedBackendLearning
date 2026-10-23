import { z } from "zod"

export const menuAddOnByIdParamsSchema = z.object({
  id: z.uuid()
}).strict()
