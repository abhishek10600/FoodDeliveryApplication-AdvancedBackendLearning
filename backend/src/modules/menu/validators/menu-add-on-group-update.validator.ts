import { z } from "zod"

export const menuAddOnGroupUpdateSchema = z.object({
  name: z.string().trim().min(1, "Menu add on group name cannot be empty").max(100, "Menu add on group name cannot be more than 100 characters").optional(),
  minSelections: z.int().min(0, "Min selection cannot be negative").optional(),
  maxSelections: z.int().min(1, "Max selections cannot be less than 1").optional(),
  displayOrder: z.int().min(0, "Display order cannot be negative").optional()
}).strict()

export type MenuAddOnGroupUpdateInput = z.infer<typeof menuAddOnGroupUpdateSchema>
