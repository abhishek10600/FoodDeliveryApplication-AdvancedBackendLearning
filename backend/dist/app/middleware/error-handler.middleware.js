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
import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../../infrastructure/container/index.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorSerializer } from "../../shared/errors/error-serializer.js";
import { InternalServerError } from "../../shared/errors/InternalServerError.js";
let ErrorHandlerMiddleware = class ErrorHandlerMiddleware {
    env;
    logger;
    constructor(env, logger) {
        this.env = env;
        this.logger = logger;
    }
    handle = (error, _req, res, next) => {
        if (res.headersSent) {
            next(error);
            return;
        }
        const appError = error instanceof AppError ? error : new InternalServerError(this.env.NODE_ENV === "production" ? "An unexpected error occurred" : error.message);
        if (appError.isOperational) {
            this.logger.warn(appError.message, {
                component: "ErrorHandler",
                operation: "handle",
                error: appError,
                errorCode: appError.code,
                statusCode: appError.statusCode
            });
        }
        else {
            this.logger.error(appError.message, appError, {
                component: "ErrorHandler",
                operation: "handle"
            });
        }
        res.status(appError.statusCode).json(ErrorSerializer.serialize(appError));
    };
};
ErrorHandlerMiddleware = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.Configuration)),
    __param(1, inject(InfrastructureTokens.Logger)),
    __metadata("design:paramtypes", [Object, Object])
], ErrorHandlerMiddleware);
export { ErrorHandlerMiddleware };
