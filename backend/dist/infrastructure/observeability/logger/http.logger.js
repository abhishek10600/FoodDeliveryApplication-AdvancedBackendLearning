var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { LoggerFactory } from "./logger.factory.js";
let HttpLogger = class HttpLogger {
    logger;
    constructor(loggerFactory) {
        this.logger = loggerFactory.create({
            component: "HttpLogger",
            module: "Infrastructure"
        });
    }
    middleware = (req, res, next) => {
        const start = process.hrtime.bigint();
        res.on("finish", () => {
            const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
            this.logger.info("HTTP request completed", {
                event: "HTTP_REQUEST",
                method: req.method,
                path: req.originalUrl,
                statusCode: res.statusCode,
                ip: req.ip,
                userAgent: req.get("user-agent"),
                contentLength: res.getHeader("content-length"),
                durationInMs: Number(durationMs.toFixed(2))
            });
        });
        next();
    };
};
HttpLogger = __decorate([
    injectable(),
    __metadata("design:paramtypes", [LoggerFactory])
], HttpLogger);
export { HttpLogger };
