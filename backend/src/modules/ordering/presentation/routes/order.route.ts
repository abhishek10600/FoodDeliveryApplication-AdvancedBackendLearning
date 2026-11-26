import { container } from "tsyringe"
import express from "express"
import { AuthenticationMiddleware } from "../../../../app/middleware/authentication.middleware.js"
import { AuthorizationMiddleware } from "../../../../app/middleware/authorization.middleware.js"
import { Permission } from "../../../identity/domain/enums/permission.enum.js"
import { CreateOrderController } from "../controllers/create-order.controller.js"
import { validate } from "../../../../shared/validation/validate.js"
import { createOrderSchema } from "../../validators/create-order.validator.js"

const router = express.Router()

const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

const createOrderController = container.resolve(CreateOrderController)

router.route("/create-order").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.ORDER_CREATE), validate({ body: createOrderSchema}), createOrderController.handle.bind(createOrderController))

export default router
