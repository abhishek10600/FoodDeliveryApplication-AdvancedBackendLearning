import type { Logger } from "pino";
import { ILogger } from "../../../shared/logger/logger.interface.js";
import { injectable} from "tsyringe";
import { LogContext } from "../../../shared/logger/log-context.js";

@injectable()
export class LoggerService implements ILogger {
  constructor(
    private readonly logger: Logger
  ) { }

  trace(message: string, context: LogContext = {}): void {
    this.logger.trace(context, message);
  }

  debug(message: string, context: LogContext = {}): void {
    this.logger.debug(context, message)
  }

  info(message: string, context: LogContext = {}): void {
    this.logger.info(context, message)
  }

  warn(message: string, context: LogContext = {}): void {
    this.logger.warn(context, message)
  }

  error(message: string, error?: unknown, context: LogContext = {}): void{
    this.logger.error({
      ...context,
      error
    },
      message
    )
  }

  fatal(message: string, error?: unknown, context: LogContext = {}): void {
    this.logger.fatal({
      ...context,
      error
    },
      message
    )
  }

  child(bindings: LogContext): ILogger {
    return new LoggerService(this.logger.child(bindings))
  }
}
