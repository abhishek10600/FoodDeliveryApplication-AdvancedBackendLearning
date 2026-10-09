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
import { MenuActivateController } from "../controllers/menu-activate.controller.js"
import { MenuDeactivateController } from "../controllers/menu-deactivate.controller.js"
import { MenuDeletionController } from "../controllers/menu-deletion.controller.js"
import { updateMenuSchema } from "../../validators/update-menu.validator.js"
import { MenuUpdationController } from "../controllers/menu-updation.controller.js"

const router = express.Router()

const menuCreationController = container.resolve(MenuCreationController)
const menuByIdController = container.resolve(MenuByIdController)
const menuUpdationController = container.resolve(MenuUpdationController)
const menuActivateController = container.resolve(MenuActivateController)
const menuDeactivateController = container.resolve(MenuDeactivateController)
const menuDeletionController = container.resolve(MenuDeletionController)

const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

router.route("/create/restaurant/:restaurantId").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_CREATE), validate({ body: createMenuSchema }), validate({ params: createMenuParamSchema }), menuCreationController.handle.bind(menuCreationController))

router.route("/:menuId").get(validate({ params: menuByIdParamSchema }), menuByIdController.handle.bind(menuByIdController))

router.route("/:menuId").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ body: updateMenuSchema }) ,validate({ params: menuByIdParamSchema }), menuUpdationController.handle.bind(menuUpdationController))

router.route("/:menuId/activate").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuByIdParamSchema }), menuActivateController.handle.bind(menuActivateController))

router.route("/:menuId/deactivate").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuByIdParamSchema }), menuDeactivateController.handle.bind(menuDeactivateController))

router.route("/:menuId").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_DELETE), validate({ params: menuByIdParamSchema }), menuDeletionController.handle.bind(menuDeletionController))

export default router;
