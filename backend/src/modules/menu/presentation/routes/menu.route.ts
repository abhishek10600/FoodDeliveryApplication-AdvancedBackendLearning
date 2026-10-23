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
import { menuItemCategoryParamsSchema } from "../../validators/menu-item-category.validator.js"
import { MenuItemCreationController } from "../controllers/menu-item-creation.controller.js"
import { createMenuItemSchema } from "../../validators/create-menu-item.validator.js"
import { MenuItemListController } from "../controllers/menu-item-list.controller.js"
import { MenuItemByIdController } from "../controllers/menu-item-by-id.controller.js"
import { menuItemByIdParamsSchema } from "../../validators/menu-item-by-id.validator.js"
import { MenuItemNameUpdateController } from "../controllers/menu-item-name-update.controller.js"
import { updateMenuItemParamsSchema } from "../../validators/update-menu-item-params.validator.js"
import { updateMenuItemNameSchema } from "../../validators/update-menu-item-name.validator.js"
import { MenuItemDescriptionUpdateController } from "../controllers/menu-item-description-update.controller.js"
import { MenuItemImageUpdateController } from "../controllers/menu-item-image-update.controller.js"
import { menuItemImageUpload } from "../middleware/menu-item-image-upload.middleware.js"
import { MenuItemPriceUpdateController } from "../controllers/menu-item-price-update.controller.js"
import { menuItemPriceUpdateSchema } from "../../validators/menu-item-price-update.validator.js"
import { MenuItemCurrencyUpdateController } from "../controllers/menu-item-currency-update.controller.js"
import { menuItemCurrencyUpdateSchema } from "../../validators/menu-item-currency-update.validator.js"
import { MenuItemStatusUpdateController } from "../controllers/menu-item-status-update.controller.js"
import { MenuItemDeletionController } from "../controllers/menu-item-deletion.controller.js"
import { MenuItemAvailabilityUpdateController } from "../controllers/menu-item-availability-update.controller.js"
import { MenuAddOnGroupCreationController } from "../controllers/menu-add-on-group-creation.controller.js"
import { menuAddOnGroupCreationSchema } from "../../validators/menu-add-on-group-creation.validator.js"
import { MenuAddOnGroupUpdateController } from "../controllers/menu-add-on-group-update.controller.js"
import { menuAddOnGroupUpdateSchema } from "../../validators/menu-add-on-group-update.validator.js"
import { MenuAddOnGroupByMenuItemIdController } from "../controllers/menu-add-on-group-by-menu-item-id.controller.js"
import { updateMenuAddOnGroupParamsSchema } from "../../validators/update-menu-add-on-group-params.validator.js"
import { MenuAddOnGroupStatusUpdateController } from "../controllers/menu-add-on-group-status-update.controller.js"
import { MenuAddOnGroupDeletionController } from "../controllers/menu-add-on-group-deletion.controller.js"
import { MenuAddOnCreationController } from "../controllers/menu-add-on-creation.controller.js"
import { menuAddOnGroupByIdParamsSchema } from "../../validators/menu-add-on-group-by-id.validator.js"
import { menuAddOnCreationSchema } from "../../validators/menu-add-on-creation.validator.js"
import { MenuAddOnUpdateController } from "../controllers/menu-add-on-update.controller.js"
import { menuAddOnUpdateParamsSchema } from "../../validators/menu-add-on-update-params.validator.js"
import { menuAddOnUpdateSchema } from "../../validators/menu-add-on-update.validator.js"
import { menuAddOnByIdParamsSchema } from "../../validators/menu-add-on-by-id-params.validator.js"
import { MenuAddOnByIdController } from "../controllers/menu-add-on-by-id.controller.js"
import { MenuAddOnStatusUpdateController } from "../controllers/menu-add-on-status-update.controller.js"
import { MenuAddOnDeletionController } from "../controllers/menu-add-on-deletion.controller.js"

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

const menuItemCreationController = container.resolve(MenuItemCreationController)
const menuItemListController = container.resolve(MenuItemListController)
const menuItemByIdController = container.resolve(MenuItemByIdController)
const menuItemNameUpdateController = container.resolve(MenuItemNameUpdateController)
const menuItemDescriptionUpdateController = container.resolve(MenuItemDescriptionUpdateController)
const menuItemImageUpdateController = container.resolve(MenuItemImageUpdateController)
const menuItemPriceUpdateController = container.resolve(MenuItemPriceUpdateController)
const menuItemCurrencyUpdateController = container.resolve(MenuItemCurrencyUpdateController)
const menuItemStatusUpdateController = container.resolve(MenuItemStatusUpdateController)
const menuItemDeletionController = container.resolve(MenuItemDeletionController)
const menuItemAvailabilityUpdateController = container.resolve(MenuItemAvailabilityUpdateController)

const menuAddOnGroupCreationController = container.resolve(MenuAddOnGroupCreationController)
const menuAddOnGroupUpdateController = container.resolve(MenuAddOnGroupUpdateController)
const menuAddOnGroupByMenuItemIdController = container.resolve(MenuAddOnGroupByMenuItemIdController)
const menuAddOnGroupStatusUpdateController = container.resolve(MenuAddOnGroupStatusUpdateController)
const menuAddOnGroupDeletionController = container.resolve(MenuAddOnGroupDeletionController)

const menuAddOnCreationController = container.resolve(MenuAddOnCreationController)
const menuAddOnUpdateController = container.resolve(MenuAddOnUpdateController)
const menuAddOnByIdController = container.resolve(MenuAddOnByIdController)
const menuAddOnStatusUpdateController = container.resolve(MenuAddOnStatusUpdateController)
const menuAddOnDeletionController = container.resolve(MenuAddOnDeletionController)

const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

// menu routes
router.route("/create/restaurant/:restaurantId").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_CREATE), validate({ body: createMenuSchema }), validate({ params: createMenuParamSchema }), menuCreationController.handle.bind(menuCreationController))

router.route("/:menuId").get(validate({ params: menuByIdParamSchema }), menuByIdController.handle.bind(menuByIdController))

router.route("/:menuId").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ body: updateMenuSchema }) ,validate({ params: menuByIdParamSchema }), menuUpdationController.handle.bind(menuUpdationController))

router.route("/:menuId/activate").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuByIdParamSchema }), menuActivateController.handle.bind(menuActivateController))

router.route("/:menuId/deactivate").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuByIdParamSchema }), menuDeactivateController.handle.bind(menuDeactivateController))

router.route("/:menuId").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_DELETE), validate({ params: menuByIdParamSchema }), menuDeletionController.handle.bind(menuDeletionController))

router.route("/restaurant/:restaurantId").get(validate({ params: restaurantByIdParamsSchema }), menuByRestaurantIdController.handle.bind(menuByRestaurantIdController))



// menu category routes
router.route("/category/:menuId/create").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ body: createMenuCategorySchema }), validate({ params: menuByIdParamSchema }), menuCategoryCreationController.handle.bind(menuCategoryCreationController))

router.route("/category/:menuId").get(validate({ params: menuByIdParamSchema }), menuCategoryListController.handle.bind(menuCategoryListController))

router.route("/category/cid/:categoryId").get(validate({ params: menuCategoryByIdParamsSchema }), menuCategoryByIdController.handle.bind(menuCategoryByIdController))

router.route("/restaurant/:restaurantId/category/:categoryId/update-name").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), validate({ body: updateMenuCategoryNameSchema }), menuCategoryNameUpdateController.handle.bind(menuCategoryNameUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/update-description").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), validate({ body: updateMenuCategoryDescriptionSchema }), menuCategoryDescriptionUpdateController.handle.bind(menuCategoryDescriptionUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/update-display-order").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), validate({ body: updateMenuCategoryDisplayOrderSchema }), menuCategoryDisplayOrderUpdateController.handle.bind(menuCategoryDisplayOrderUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/update-status").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), menuCategoryStatusUpdateController.handle.bind(menuCategoryStatusUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuCategoryParamsSchema }), menuCategoryDeleteController.handle.bind(menuCategoryDeleteController))


// menu item route
router.route("/restaurant/:restaurantId/category/:categoryId/menu-item/create").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuItemCategoryParamsSchema }), validate({ body: createMenuItemSchema }), menuItemCreationController.handle.bind(menuItemCreationController))

router.route("/category/:categoryId/menu-item/list").get(validate({ params: menuCategoryByIdParamsSchema }), menuItemListController.handle.bind(menuItemListController))

router.route("/menu-item/:id").get(validate({ params: menuItemByIdParamsSchema }), menuItemByIdController.handle.bind(menuItemByIdController))

router.route("/restaurant/:restaurantId/category/:categoryId/menu-item/:menuItemId/update-name").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuItemParamsSchema }), validate({ body: updateMenuItemNameSchema }), menuItemNameUpdateController.handle.bind(menuItemNameUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/menu-item/:menuItemId/update-description").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuItemParamsSchema }), menuItemDescriptionUpdateController.handle.bind(menuItemDescriptionUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/menu-item/:menuItemId/update-image").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuItemParamsSchema }), menuItemImageUpload.single("menuItemImage"), menuItemImageUpdateController.handle.bind(menuItemImageUpdateController))

router.route("/restaurant/:restaurantId/category/:categoryId/menu-item/:menuItemId/update-price").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuItemParamsSchema }), validate({ body: menuItemPriceUpdateSchema }), menuItemPriceUpdateController.handle.bind(menuItemPriceUpdateController))

router.route("/menu-item/:id/update-currency").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuItemByIdParamsSchema }), validate({ body: menuItemCurrencyUpdateSchema }), menuItemCurrencyUpdateController.handle.bind(menuItemCurrencyUpdateController))

router.route("/menu-item/:id/update-status").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuItemByIdParamsSchema }), menuItemStatusUpdateController.handle.bind(menuItemStatusUpdateController))

router.route("/menu-item/:id/update-availability").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuItemByIdParamsSchema }), menuItemAvailabilityUpdateController.handle.bind(menuItemAvailabilityUpdateController))

router.route("/menu-item/:id").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuItemByIdParamsSchema }), menuItemDeletionController.handle.bind(menuItemDeletionController))



// menu add on group route
router.route("/menu-add-on-group/menu-item/:id").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuItemByIdParamsSchema }), validate({ body: menuAddOnGroupCreationSchema }), menuAddOnGroupCreationController.handle.bind(menuAddOnGroupCreationController))

router.route("/menu-add-on-group/menu-item/:id").get(validate({ params: menuItemByIdParamsSchema }), menuAddOnGroupByMenuItemIdController.handle.bind(menuAddOnGroupByMenuItemIdController))

router.route("/menu-add-on-group/:menuAddOnGroupId/menu-item/:menuItemId").put(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuAddOnGroupParamsSchema }), validate({ body: menuAddOnGroupUpdateSchema }), menuAddOnGroupUpdateController.handle.bind(menuAddOnGroupUpdateController))

router.route("/menu-add-on-group/:menuAddOnGroupId/menu-item/:menuItemId").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuAddOnGroupParamsSchema }), menuAddOnGroupStatusUpdateController.handle.bind(menuAddOnGroupStatusUpdateController))

router.route("/menu-add-on-group/:menuAddOnGroupId/menu-item/:menuItemId").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: updateMenuAddOnGroupParamsSchema }), menuAddOnGroupDeletionController.handle.bind(menuAddOnGroupDeletionController))


// menu add on route
router.route("/menu-add-on/menuAddOnGroup/:menuAddOnGroupId").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuAddOnGroupByIdParamsSchema }), validate({ body: menuAddOnCreationSchema }), menuAddOnCreationController.handle.bind(menuAddOnCreationController))

router.route("/menu-add-on/:id").get(validate({ params: menuAddOnByIdParamsSchema}), menuAddOnByIdController.handle.bind(menuAddOnByIdController))

router.route("/menu-add-on/:id/menuAddOnGroup/:menuAddOnGroupId").put(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuAddOnUpdateParamsSchema }), validate({ body: menuAddOnUpdateSchema }), menuAddOnUpdateController.handle.bind(menuAddOnUpdateController))

router.route("/menu-add-on/:id/menuAddOnGroup/:menuAddOnGroupId").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuAddOnUpdateParamsSchema }), menuAddOnStatusUpdateController.handle.bind(menuAddOnStatusUpdateController))

router.route("/menu-add-on/:id/menuAddOnGroup/:menuAddOnGroupId").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.MENU_UPDATE), validate({ params: menuAddOnUpdateParamsSchema}), menuAddOnDeletionController.handle.bind(menuAddOnDeletionController))

export default router;
