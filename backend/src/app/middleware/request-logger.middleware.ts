import { NextFunction, Request, Response } from "express";
import { logger } from "../../config/logger.js";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint()

  res.on("finish", () => {

    const duration = Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.info({
      event: "HTTP_REQUEST",
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      durationInMs: Number(duration.toFixed(2))
    })
  })

  next()
}
