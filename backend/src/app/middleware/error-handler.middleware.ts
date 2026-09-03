import { injectable, inject} from "tsyringe"
import { InfrastructureTokens } from "../../infrastructure/container/index.js";
import type { ILogger } from "../../shared/logger/logger.interface.js";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ErrorSerializer } from "../../shared/errors/error-serializer.js";
import type { Env } from "../../config/env.schema.js";
import { mapError } from "../../shared/errors/error-mapper.js";

@injectable()
export class ErrorHandlerMiddleware {
  constructor(

    @inject(InfrastructureTokens.Configuration)
    private readonly env: Env,

    @inject(InfrastructureTokens.Logger)
    private readonly logger: ILogger

  ) { }

  handle: ErrorRequestHandler = (error: Error & {
    isOperational?: boolean
  }, _req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      next(error);
      return;
    }

    console.error(error)

    const appError = mapError(error, this.env.NODE_ENV === "production");

    if (appError.isOperational) {
      this.logger.warn(appError.message, {
        component: "ErrorHandler",
        operation: "handle",
        error: appError,
        errorCode: appError.code,
        statusCode: appError.statusCode
      })
    } else {
      this.logger.error(appError.message, appError, {
        component: "ErrorHandler",
        operation: "handle"
      })
    }

    console.error(error)

    res.status(appError.statusCode).json(ErrorSerializer.serialize(appError))
  }
}
