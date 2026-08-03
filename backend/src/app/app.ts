import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "../config/cors.js";
import healthRouter from "./health.route.js";
import { container } from "tsyringe";
import { HttpLogger } from "../infrastructure/observeability/logger/http.logger.js";

export const app = express()

app.use(helmet())

const httpLogger = container.resolve(HttpLogger)
app.use(httpLogger.middleware)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors(corsOptions))

app.use(healthRouter)
