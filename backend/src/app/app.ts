import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "../config/cors.js";

export const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors(corsOptions))
