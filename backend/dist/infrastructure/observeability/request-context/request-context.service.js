var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import { requestContextStore } from "../../../shared/request-context/request-context.js";
let RequestContextService = class RequestContextService {
    run(context, callback) {
        return requestContextStore.run(context, callback);
    }
    get() {
        return requestContextStore.get();
    }
    getOrThrow() {
        return requestContextStore.getOrThrow();
    }
    has() {
        return requestContextStore.has();
    }
    set(values) {
        requestContextStore.set(values);
    }
    disable() {
        requestContextStore.disable();
    }
};
RequestContextService = __decorate([
    injectable()
], RequestContextService);
export { RequestContextService };
