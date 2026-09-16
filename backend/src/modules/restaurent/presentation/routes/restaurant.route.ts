import express from "express"
import { container } from "tsyringe"
import { RegisterRestaurantOwnerController } from "../controllers/register-restaurant-owner.controller.js"
import { validate } from "../../../../shared/validation/validate.js"
import { registerRestaurantOwnerSchema } from "../../validators/register-restaurant-owner.validator.js"
import { CreateRestaurantController } from "../controllers/create-restaurant.controller.js"
import { AuthenticationMiddleware } from "../../../../app/middleware/authentication.middleware.js"
import { AuthorizationMiddleware } from "../../../../app/middleware/authorization.middleware.js"
import { createRestaurantSchema } from "../../validators/restaurant-creation.validator.js"
import { Permission } from "../../../identity/domain/enums/permission.enum.js"

const router = express.Router()

const registerRestaurantOwnerController = container.resolve(RegisterRestaurantOwnerController)
const createRestaurantController = container.resolve(CreateRestaurantController)
const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

router.route("/owner/register").post(validate({ body: registerRestaurantOwnerSchema }), registerRestaurantOwnerController.handle.bind(registerRestaurantOwnerController))

router.route("/create").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_CREATE), validate({body: createRestaurantSchema}), createRestaurantController.handle.bind(createRestaurantController))

export default router
