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
import { MenuCategoryCreationController } from "../controllers/menu-category-creation.controller.js"
import { createMenuCategorySchema } from "../../validators/create-menu-category.validator.js"
import { MenuByRestaurantIdController } from "../controllers/menu-by-restaurant-id.controller.js"
import { restaurantByIdParamsSchema } from "../../../restaurent/validators/restaurant-by-id.validator.js"
import { MenuCategoryListController } from "../controllers/menu-category-list.controller.js"
import { menuCategoryByIdParamsSchema } from "../../validators/menu-category-by-id.validator.js"
import { MenuCategoryByIdController } from "../controllers/menu-category-by-id.controller.js"
import { updateMenuCategoryNameSchema } from "../../validators/update-menu-category-name.validator.js"
import { MenuCategoryNameUpdateController } from "../controllers/menu-category-name-update.controller.js"
import { updateMenuCategoryParamsSchema } from "../../validators/update-menu-category.validator.js"
import { MenuCategoryDescriptionUpdateController } from "../controllers/menu-category-description-update.controller.js"
import { updateMenuCategoryDescriptionSchema } from "../../validators/update-menu-category-description.validator.js"
import { MenuCategoryDisplayOrderUpdateController } from "../controllers/menu-category-display-order-update.controller.js"
import { updateMenuCategoryDisplayOrderSchema } from "../../validators/update-menu-category-display-order.validator.js"
import { MenuCategoryStatusUpdateController } from "../controllers/menu-category-status-update.controller.js"
import { MenuCategoryDeleteController } from "../controllers/menu-category-delete.controller.js"

const router = express.Router()

const menuCreationController = container.resolve(MenuCreationController)
const menuByIdController = container.resolve(MenuByIdController)
const menuUpdationController = container.resolve(MenuUpdationController)
const menuActivateController = container.resolve(MenuActivateController)
const menuDeactivateController = container.resolve(MenuDeactivateController)
const menuDeletionController = container.resolve(MenuDeletionController)
const menuByRestaurantIdController = container.resolve(MenuByRestaurantIdController)

const menuCategoryCreationController = container.resolve(MenuCategoryCreationController)
const menuCategoryListController = container.resolve(MenuCategoryListController)
const menuCategoryByIdController = container.resolve(MenuCategoryByIdController)
const menuCategoryNameUpdateController = container.resolve(MenuCategoryNameUpdateController)
const menuCategoryDescriptionUpdateController = container.resolve(MenuCategoryDescriptionUpdateController)
const menuCategoryDisplayOrderUpdateController = container.resolve(MenuCategoryDisplayOrderUpdateController)
const menuCategoryStatusUpdateController = container.resolve(MenuCategoryStatusUpdateController)
const menuCategoryDeleteController = container.resolve(MenuCategoryDeleteController)

const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

// menu routes
router.route("/create/restaurant/:restaurantId").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_CREATE), validate({ body: createMenuSchema }), validate({ params: createMenuParamSchema }), menuCreationController.handle.bind(menuCreationController))

router.route("/:menuId").get(validate({ params: menuByIdParamSchema }), menuByIdController.handle.bind(menuByIdController))

router.route("/:menuId").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ body: updateMenuSchema }) ,validate({ params: menuByIdParamSchema }), menuUpdationController.handle.bind(menuUpdationController))

router.route("/:menuId/activate").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuByIdParamSchema }), menuActivateController.handle.bind(menuActivateController))

router.route("/:menuId/deactivate").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuByIdParamSchema }), menuDeactivateController.handle.bind(menuDeactivateController))

router.route("/:menuId").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_DELETE), validate({ params: menuByIdParamSchema }), menuDeletionController.handle.bind(menuDeletionController))

router.route("/restaurant/:restaurantId").get(validate({params: restaurantByIdParamsSchema}), menuByRestaurantIdController.handle.bind(menuByRestaurantIdController))



// menu category routes
router.route("/category/:menuId/create").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ body: createMenuCategorySchema }), validate({ params: menuByIdParamSchema }), menuCategoryCreationController.handle.bind(menuCategoryCreationController))

router.route("/category/:menuId").get(validate({ params: menuByIdParamSchema }), menuCategoryListController.handle.bind(menuCategoryListController))

router.route("/category/cid/:categoryId").get(validate({ params: menuCategoryByIdParamsSchema }), menuCategoryByIdController.handle.bind(menuCategoryByIdController))

router.route("/restaurant/:restaurantId/category/:categoryId/update-name").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), validate({ body: updateMenuCategoryNameSchema }), menuCategoryNameUpdateController.handle.bind(menuCategoryNameUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/update-description").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), validate({ body: updateMenuCategoryDescriptionSchema }), menuCategoryDescriptionUpdateController.handle.bind(menuCategoryDescriptionUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/update-display-order").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), validate({ body: updateMenuCategoryDisplayOrderSchema }), menuCategoryDisplayOrderUpdateController.handle.bind(menuCategoryDisplayOrderUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/update-status").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), menuCategoryStatusUpdateController.handle.bind(menuCategoryStatusUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), menuCategoryDeleteController.handle.bind(menuCategoryDeleteController))

export default router;
