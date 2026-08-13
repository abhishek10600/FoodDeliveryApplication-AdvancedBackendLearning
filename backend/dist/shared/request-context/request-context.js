import { AsyncLocalStorage } from "node:async_hooks";
export class RequestContextStore {
    storage = new AsyncLocalStorage();
    run(context, callback) {
        return this.storage.run(context, callback);
    }
    get() {
        return this.storage.getStore();
    }
    getOrThrow() {
        const context = this.storage.getStore();
        if (!context) {
            throw new Error("RequestContext is unavailable. Ensure RequestContextMiddleware is registered.");
        }
        return context;
    }
    has() {
        return this.storage.getStore() !== undefined;
    }
    set(values) {
        const context = this.getOrThrow();
        Object.assign(context, values);
    }
    disable() {
        this.storage.disable();
    }
}
export const requestContextStore = new RequestContextStore();
