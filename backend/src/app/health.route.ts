import express from "express"
import { HealthController } from "./health.controller.js"

const healthRouter = express.Router()

const healthController = new HealthController()

healthRouter.route("/live").get(healthController.live)
healthRouter.route("/health").get(healthController.health)

export default healthRouter
