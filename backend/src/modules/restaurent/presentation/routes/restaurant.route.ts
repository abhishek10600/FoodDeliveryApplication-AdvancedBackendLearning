import express from "express"
import { container } from "tsyringe"
import { RegisterRestaurantOwnerController } from "../controllers/register-restaurant-owner.controller.js"
import { validate } from "../../../../shared/validation/validate.js"
import { registerRestaurantOwnerSchema } from "../../validators/register-restaurant-owner.validator.js"

const router = express.Router()

const registerRestaurantOwnerController = container.resolve(RegisterRestaurantOwnerController)

router.route("/owner/register").post(validate({ body: registerRestaurantOwnerSchema }), registerRestaurantOwnerController.handle.bind(registerRestaurantOwnerController))

export default router
