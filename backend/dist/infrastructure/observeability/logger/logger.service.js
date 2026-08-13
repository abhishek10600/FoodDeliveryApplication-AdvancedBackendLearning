var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LoggerService_1;
import { inject, injectable } from "tsyringe";
import { InfrastructureTokens } from "../../container/index.js";
import { RequestContextService } from "../request-context/request-context.service.js";
let LoggerService = LoggerService_1 = class LoggerService {
    logger;
    requestContext;
    constructor(logger, requestContext) {
        this.logger = logger;
        this.requestContext = requestContext;
    }
    enrich(context = {}) {
        const request = this.requestContext.get();
        return {
            requestId: request?.requestId,
            correlationId: request?.correlationId,
            userId: context?.userId,
            ...context
        };
    }
    trace(message, context = {}) {
        this.logger.trace(this.enrich(context), message);
    }
    debug(message, context = {}) {
        this.logger.debug(this.enrich(context), message);
    }
    info(message, context = {}) {
        this.logger.info(this.enrich(context), message);
    }
    warn(message, context = {}) {
        this.logger.warn(this.enrich(context), message);
    }
    error(message, error, context = {}) {
        this.logger.error(this.enrich({
            ...context,
            error
        }), message);
    }
    fatal(message, error, context = {}) {
        this.logger.fatal(this.enrich({
            ...context,
            error
        }), message);
    }
    child(bindings) {
        return new LoggerService_1(this.logger.child(bindings), this.requestContext);
    }
};
LoggerService = LoggerService_1 = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.PinoLogger)),
    __param(1, inject(InfrastructureTokens.RequestContextService)),
    __metadata("design:paramtypes", [Object, RequestContextService])
], LoggerService);
export { LoggerService };
