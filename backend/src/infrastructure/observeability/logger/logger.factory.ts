import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../../container/index.js";
import type { ILogger } from "../../../shared/logger/logger.interface.js";
import type { LogContext } from "../../../shared/logger/log-context.js";

@injectable()
export class LoggerFactory {
  constructor(

    @inject(InfrastructureTokens.Logger)
    private readonly logger: ILogger

  ) { }

  create(context: LogContext){
    return this.logger.child(context)
  }
}
