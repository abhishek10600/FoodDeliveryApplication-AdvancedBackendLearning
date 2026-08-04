import type { Logger } from "pino";
import { ILogger } from "../../../shared/logger/logger.interface.js";
import { inject, injectable} from "tsyringe";
import { LogContext } from "../../../shared/logger/log-context.js";
import { InfrastructureTokens } from "../../container/index.js";
import { RequestContextService } from "../request-context/request-context.service.js";

@injectable()
export class LoggerService implements ILogger {
  constructor(

    @inject(InfrastructureTokens.PinoLogger)
    private readonly logger: Logger,

    @inject(InfrastructureTokens.RequestContextService)
    private readonly requestContext: RequestContextService
  ) { }

  private enrich(context: LogContext = {}) {
    const request = this.requestContext.get();

    return {
      requestId: request?.requestId,
      correlationId: request?.correlationId,
      userId: context?.userId,
      ...context
    }
  }

  trace(message: string, context: LogContext = {}): void {
    this.logger.trace(this.enrich(context), message);
  }

  debug(message: string, context: LogContext = {}): void {
    this.logger.debug(this.enrich(context), message)
  }

  info(message: string, context: LogContext = {}): void {
    this.logger.info(this.enrich(context), message)
  }

  warn(message: string, context: LogContext = {}): void {
    this.logger.warn(this.enrich(context), message)
  }

  error(message: string, error?: unknown, context: LogContext = {}): void{
    this.logger.error(this.enrich({
      ...context,
      error
    }), message)
  }

  fatal(message: string, error?: unknown, context: LogContext = {}): void {
    this.logger.fatal(this.enrich({
      ...context,
      error
    }), message)
  }

  child(bindings: LogContext): ILogger {
    return new LoggerService(this.logger.child(bindings), this.requestContext)
  }
}
