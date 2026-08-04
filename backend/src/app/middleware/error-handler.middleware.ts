import { injectable, inject} from "tsyringe"
import { InfrastructureTokens } from "../../infrastructure/container/index.js";
import type { ILogger } from "../../shared/logger/logger.interface.js";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorSerializer } from "../../shared/errors/error-serializer.js";
import type { Env } from "../../config/env.schema.js";

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
  }, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      next(error);
      return;
    }

    if (error instanceof AppError) {
      this.logger.warn(error.message, {
        component: "ErrorHandler",
        operation: "handle",
        errroCode: error.code,
        statusCode: error.statusCode,
        isOperational: error.isOperational
      })

      res.status(error.statusCode).json(ErrorSerializer.serialize(error))

      return;
    }

    this.logger.error("Unhandled exception", error, {
      component: "ErrorHandler",
      operation: "handle"
    })

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: this.env.NODE_ENV === "production" ? "An unexpected error ocurred." : error instanceof Error ? error.message : "Unknown error"
      }
    })
  }
}
