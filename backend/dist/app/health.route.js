import express from "express";
import { container } from "tsyringe";
import { HealthController } from "./health.controller.js";
const healthRouter = express.Router();
const healthController = container.resolve(HealthController);
healthRouter.route("/live").get(healthController.live);
healthRouter.route("/health").get(healthController.health);
export default healthRouter;
