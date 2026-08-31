import express from "express";
import healthRouter from "./health.route.js";
import { container } from "tsyringe";
import { HttpLogger } from "../infrastructure/observeability/logger/http.logger.js";
import { RequestContextMiddleware } from "../infrastructure/observeability/request-context/request-context.middleware.js";
import { ErrorHandlerMiddleware } from "./middleware/error-handler.middleware.js";
import { registerSecurity } from "../infrastructure/security/security.js";

export const app = express()

registerSecurity(app)

const requestContextMiddleware = container.resolve(RequestContextMiddleware)
app.use(requestContextMiddleware.handle)

const httpLogger = container.resolve(HttpLogger)
app.use(httpLogger.middleware)

app.use(healthRouter)

import identityRouter from "../modules/identity/presentation/routes/identity.route.js"
import customersRouter from "../modules/customer/presentation/routes/customer.route.js"

app.use("/api/v1/identity", identityRouter)
app.use("/api/v1/customers", customersRouter)

const errorHandler = container.resolve(ErrorHandlerMiddleware)
app.use(errorHandler.handle)
