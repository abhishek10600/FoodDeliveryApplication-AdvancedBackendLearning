import { AsyncLocalStorage } from "node:async_hooks";
import { RequestContext } from "./request-context.interface.js";

export class RequestContextStore {
  private readonly storage = new AsyncLocalStorage<RequestContext>()

  run<T>(context: RequestContext, callback: () => T): T {
    return this.storage.run(context, callback)
  }

  get(): RequestContext | undefined {
    return this.storage.getStore();
  }

  getOrThrow(): RequestContext {
    const context = this.storage.getStore()

    if (!context) {
      throw new Error("RequestContext is unavailable. Ensure RequestContextMiddleware is registered.")
    }

    return context;
  }

  has(): boolean {
    return this.storage.getStore() !== undefined
  }

  set(values: Partial<RequestContext>): void {
    const context = this.getOrThrow();

    Object.assign(context, values)
  }

  disable(): void {
    this.storage.disable()
  }
}

export const requestContextStore = new RequestContextStore()
