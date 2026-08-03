import { injectable } from "tsyringe";
import type { ILogger } from "../../../shared/logger/logger.interface.js";
import { LoggerFactory } from "./logger.factory.js";
import { NextFunction, Request, Response } from "express";

@injectable()
export class HttpLogger {
  private readonly logger: ILogger

  constructor(

    loggerFactory: LoggerFactory,

  ) {
    this.logger = loggerFactory.create({
      component: "HttpLogger",
      module: "Infrastructure"
    })
  }

  middleware = (req: Request, res: Response, next: NextFunction): void => {
    const start = process.hrtime.bigint()

    res.on("finish", () => {

      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

      this.logger.info("HTTP request completed", {
        event: "HTTP_REQUEST",
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        contentLength: res.getHeader("content-length"),
        durationInMs: Number(durationMs.toFixed(2))
      })
    })

    next()
  }
}
