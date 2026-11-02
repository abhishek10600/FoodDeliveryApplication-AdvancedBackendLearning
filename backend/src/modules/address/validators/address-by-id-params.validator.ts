import { z } from "zod"

export const addressByIdParamsSchema = z.object({
  id: z.uuid()
}).strict()

export type AddressByIdParamsInput = z.infer<typeof addressByIdParamsSchema>
