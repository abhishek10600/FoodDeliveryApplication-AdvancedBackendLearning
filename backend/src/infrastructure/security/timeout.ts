import timeout from "connect-timeout"
import { NextFunction, Request, Response, type RequestHandler } from "express"
import { env } from "../../config/env.config.js"

export const timeoutMiddleware: RequestHandler = timeout(
  env.REQUEST_TIMEOUT
) as RequestHandler

export const haltOnTimeout: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.timedout) {
    next()
  }
}
