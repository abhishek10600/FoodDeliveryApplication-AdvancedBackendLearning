import type { ZodType } from "zod"

export interface ValidationSchema {
  body?: ZodType,
  params?: ZodType,
  query?: ZodType
}
