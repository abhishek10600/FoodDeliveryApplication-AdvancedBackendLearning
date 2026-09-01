import { container } from "tsyringe"
import express from "express"
import { GetCustomerProfileController } from "../controllers/get-customer-profile.controller.js"
import { AuthenticationMiddleware } from "../../../../app/middleware/authentication.middleware.js"
import { AuthorizationMiddleware } from "../../../../app/middleware/authorization.middleware.js"
import { Permission } from "../../../identity/domain/enums/permission.enum.js"
import { UpdateCustomerProfileController } from "../controllers/update-customer-profile.controller.js"
import { validate } from "../../../../shared/validation/validate.js"
import { updateCustomerProfileSchema } from "../../validators/update-customer-profile.validator.js"

const router = express.Router()

const getCustomerProfileController = container.resolve(GetCustomerProfileController)
const updateCustomerProfileController = container.resolve(UpdateCustomerProfileController)
const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

router.route("/me").get(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.CUSTOMER_PROFILE_READ), getCustomerProfileController.handle.bind(getCustomerProfileController))

router.route("/update-profile").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.CUSTOMER_PROFILE_UPDATE), validate({body: updateCustomerProfileSchema}), updateCustomerProfileController.handle.bind(updateCustomerProfileController))

export default router;
