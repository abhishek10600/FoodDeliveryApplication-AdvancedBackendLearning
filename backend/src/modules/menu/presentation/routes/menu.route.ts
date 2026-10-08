import { container } from "tsyringe"
import express from "express"
import { MenuCreationController } from "../controllers/menu-creation.controller.js"
import { AuthenticationMiddleware } from "../../../../app/middleware/authentication.middleware.js"
import { AuthorizationMiddleware } from "../../../../app/middleware/authorization.middleware.js"
import { Permission } from "../../../identity/domain/enums/permission.enum.js"
import { validate } from "../../../../shared/validation/validate.js"
import { createMenuParamSchema, createMenuSchema } from "../../validators/create-menu.validator.js"
import { menuByIdParamSchema } from "../../validators/menu-by-id.validator.js"
import { MenuByIdController } from "../controllers/menu-by-id.controller.js"


const router = express.Router()

const menuCreationController = container.resolve(MenuCreationController)
const menuByIdController = container.resolve(MenuByIdController)

const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

router.route("/create/restaurant/:restaurantId").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_CREATE), validate({ body: createMenuSchema }), validate({ params: createMenuParamSchema }), menuCreationController.handle.bind(menuCreationController))

router.route("/:menuId").get(validate({ params: menuByIdParamSchema }), menuByIdController.handle.bind(menuByIdController))

export default router;
