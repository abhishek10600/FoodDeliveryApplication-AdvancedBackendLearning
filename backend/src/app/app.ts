import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "../config/cors.js";
import healthRouter from "./health.route.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";

export const app = express()

app.use(helmet())
app.use(requestLogger)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors(corsOptions))

app.use(healthRouter)
