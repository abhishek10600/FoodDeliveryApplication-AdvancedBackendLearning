import { container } from "tsyringe"
import exporess from "express"
import { validate } from "../../../../shared/validation/validate.js"
import { registerDriverSchema } from "../../validators/register-driver-validator.js"
import { RegisterDriverController } from "../controllers/register-driver.controller.js"
import { DriverProfileController } from "../controllers/driver-profile.controller.js"
import { AuthenticationMiddleware } from "../../../../app/middleware/authentication.middleware.js"
import { AuthorizationMiddleware } from "../../../../app/middleware/authorization.middleware.js"
import { Permission } from "../../../identity/domain/enums/permission.enum.js"
import { DriverProfileUpdateController } from "../controllers/driver-profile-update.controller.js"
import { driverProfileUpdateSchema } from "../../validators/driver-profile-update.validator.js"
import { DriverAvailabilityUpdateController } from "../controllers/driver-availability-update.controller.js"

const router = exporess.Router()

const registerDriverController = container.resolve(RegisterDriverController)
const driverProfileController = container.resolve(DriverProfileController)
const driverProfileUpdateController = container.resolve(DriverProfileUpdateController)
const driverAvailabilityUpdateController = container.resolve(DriverAvailabilityUpdateController)

const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

router.route("/register").post(validate({ body: registerDriverSchema }), registerDriverController.handle.bind(registerDriverController))

router.route("/profile/me").get(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.DRIVER_READ), driverProfileController.handle.bind(driverProfileController))

router.route("/profile/me").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.DRIVER_UPDATE), validate({ body: driverProfileUpdateSchema }), driverProfileUpdateController.handle.bind(driverProfileUpdateController))

router.route("/profile/me/update-availability").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.DRIVER_UPDATE), driverAvailabilityUpdateController.handle.bind(driverAvailabilityUpdateController))

export default router
