import { z } from "zod";

export const updateCustomerPreferencesSchema = z.object({

  language: z.string().min(1, "Language cannot be empty.").max(30, "Language cannot be more than 30 characters.").optional(),

  notifications: z.object({
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
    email: z.boolean().optional()
  }).optional(),

  marketing: z.object({
    enabled: z.boolean().optional()
  }).optional()

})

export type UpdateCustomerPreferencesRequest = z.infer<typeof updateCustomerPreferencesSchema>
