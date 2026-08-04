import { injectable } from "tsyringe";
import { RequestContext } from "../../../shared/request-context/request-context.interface.js";
import { requestContextStore } from "../../../shared/request-context/request-context.js";

@injectable()
export class RequestContextService {

  run<T>(context: RequestContext, callback: () => T): T {
    return requestContextStore.run(context, callback)
  }

  get(): RequestContext | undefined {
    return requestContextStore.get()
  }

  getOrThrow(): RequestContext {
    return requestContextStore.getOrThrow()
  }

  has(): boolean {
    return requestContextStore.has()
  }

  set(values: Partial<RequestContext>): void {
    requestContextStore.set(values)
  }

  disable(): void {
    requestContextStore.disable()
  }

}
