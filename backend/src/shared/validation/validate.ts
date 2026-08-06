import { NextFunction, Request, RequestHandler, Response } from "express";
import { ValidationSchema } from "./validation-schema.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ValidationFormatter } from "./validation-error.js";

export const validate = (schema: ValidationSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (schema.body) {
      const result = schema.body.safeParse(req.body)

      if (!result.success) {
        return next(
          new ValidationError(
            ValidationFormatter.format(result.error)
          )
        )
      }

      req.body = result.data
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params)

      if (!result.success) {
        return next(
          new ValidationError(
            ValidationFormatter.format(result.error)
          )
        )
      }

      req.params = result.data as Request["params"]
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.params)

      if (!result.success) {
        return next(
          new ValidationError(
            ValidationFormatter.format(result.error)
          )
        )
      }

      req.query = result.data as Request["query"]
    }

    next()
  }
}
