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
import { RestaurantProfileController } from "../controllers/restaurant-profile.controller.js"
import { RestaurantByOwnerController } from "../controllers/restaurant-by-owner.controller.js"
import { RestaurantProfileUpdateController } from "../controllers/restaurant-profile-update.controller.js"
import { restaurantProfileUpdateParamsSchema, restaurantProfileUpdateSchema } from "../../validators/restaurant-profile-update.validator.js"
import { restaurantStatusUpdateParamsSchema } from "../../validators/restaurant-status-update.validator.js"
import { RestaurantStatusUpdateController } from "../controllers/restaurant-status-update.controller.js"
import { RestaurantStatusCloseController } from "../controllers/restaurant-status-close.controller.js"
import { restaurantOpeningHoursUpdateParamsSchema, restaurantOpeningHoursUpdateSchema } from "../../validators/restaurant-opening-hours-update.validator.js"
import { RestaurantOpeningHoursUpdateController } from "../controllers/restaurant-opening-hours-update.controller.js"
import { CreateRestaurantCuisineController } from "../controllers/create-restaurant-cuisine.controller.js"
import { restaurantCuisineCreationParamsSchema, restaurantCuisineCreationSchema } from "../../validators/restaurant-cuisine-creation.validator.js"
import { RestaurantCuisineUpdateController } from "../controllers/restaurant-cuisine-update.controller.js"
import { restaurantCuisineUpdatePramsSchema, restaurantCuisineUpdateSchema } from "../../validators/restaurant-cuisine-update.validator.js"
import { RestaurantCuisineStatusUpdateController } from "../controllers/restaurant-cuisine-status-update.controller.js"
import { restaurantCuisineStatusUpdateParamsSchema } from "../../validators/restaurant-cuisine-status-update.validator.js"
import { DeleteRestaurantCuisineController } from "../controllers/delete-restaurant-cuisine.controller.js"
import { restaurantCuisineDeletionSchema } from "../../validators/restaurant-cuisine-deletion.validator.js"

const router = express.Router()

const registerRestaurantOwnerController = container.resolve(RegisterRestaurantOwnerController)
const restaurantProfileController = container.resolve(RestaurantProfileController)
const createRestaurantController = container.resolve(CreateRestaurantController)
const restaurantByOwnerController = container.resolve(RestaurantByOwnerController)
const restaurantProfileUpdateController = container.resolve(RestaurantProfileUpdateController)
const restaurantStatusUpdateController = container.resolve(RestaurantStatusUpdateController)
const restaurantStatusCloseController = container.resolve(RestaurantStatusCloseController)
const restaurantOpeningHoursUpdateController = container.resolve(RestaurantOpeningHoursUpdateController)
const createRestaurantCuisineController = container.resolve(CreateRestaurantCuisineController)
const restaurantCuisineUpdateController = container.resolve(RestaurantCuisineUpdateController)
const restaurantCuisineStatusUpdateController = container.resolve(RestaurantCuisineStatusUpdateController)
const deleteRestaurantCuisineController = container.resolve(DeleteRestaurantCuisineController)

const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

router.route("/owner/register").post(validate({ body: registerRestaurantOwnerSchema }), registerRestaurantOwnerController.handle.bind(registerRestaurantOwnerController))

router.route("/create").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_CREATE), validate({ body: createRestaurantSchema }), createRestaurantController.handle.bind(createRestaurantController))

router.route("/owner").get(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_READ), restaurantByOwnerController.handle.bind(restaurantByOwnerController))

router.route("/:restaurantId").get(restaurantProfileController.handle.bind(restaurantProfileController))

router.route("/:restaurantId").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_UPDATE), validate({ body: restaurantProfileUpdateSchema }), validate({ params: restaurantProfileUpdateParamsSchema }), restaurantProfileUpdateController.handle.bind(restaurantProfileUpdateController))

router.route("/:restaurantId/update-status").put(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_STATUS_UPDATE), validate({ params: restaurantStatusUpdateParamsSchema }), restaurantStatusUpdateController.handle.bind(restaurantStatusUpdateController))

router.route("/:restaurantId/close").put(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_STATUS_UPDATE), validate({ params: restaurantStatusUpdateParamsSchema }), restaurantStatusCloseController.handle.bind(restaurantStatusCloseController))

router.route("/:restaurantId/opening-hours/update").put(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_UPDATE), validate({ params: restaurantOpeningHoursUpdateParamsSchema }), validate({ body: restaurantOpeningHoursUpdateSchema }), restaurantOpeningHoursUpdateController.handle.bind(restaurantOpeningHoursUpdateController))

router.route("/:restaurantId/cuisines/create").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_UPDATE), validate({ params: restaurantCuisineCreationParamsSchema }), validate({ body: restaurantCuisineCreationSchema }), createRestaurantCuisineController.handle.bind(createRestaurantCuisineController))

router.route("/:restaurantId/cuisines/:cuisineId").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_UPDATE), validate({ params: restaurantCuisineUpdatePramsSchema }), validate({ body: restaurantCuisineUpdateSchema }),
  restaurantCuisineUpdateController.handle.bind(restaurantCuisineUpdateController))

router.route("/:restaurantId/cuisines/:cuisineId/status-update").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_UPDATE), validate({ params: restaurantCuisineStatusUpdateParamsSchema }), restaurantCuisineStatusUpdateController.handle.bind(restaurantCuisineStatusUpdateController))

router.route("/:restaurantId/cuisines/:cuisineId").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.RESTAURANT_UPDATE), validate({ params: restaurantCuisineDeletionSchema }), deleteRestaurantCuisineController.handle.bind(deleteRestaurantCuisineController))


export default router
