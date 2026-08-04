import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../../container/index.js";
import { RequestContextService } from "./request-context.service.js";
import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

@injectable()
export class RequestContextMiddleware {

  constructor(

    @inject(InfrastructureTokens.RequestContextService)
    private readonly requestContextServie: RequestContextService

  ) { }

  handle = (req: Request, res: Response, next: NextFunction): void => {
    const requestId = randomUUID()

    const correlationIdHeader = req.header("x-correlation-id")

    const correlationId = typeof correlationIdHeader === "string" && correlationIdHeader.trim().length > 0 ? correlationIdHeader : requestId

    this.requestContextServie.run({
      requestId,
      correlationId
    }, () => {
      next()
    })
  }

}
