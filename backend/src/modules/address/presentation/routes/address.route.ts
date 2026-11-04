import { container } from "tsyringe"
import express from "express"
import { AuthorizationMiddleware } from "../../../../app/middleware/authorization.middleware.js"
import { AuthenticationMiddleware } from "../../../../app/middleware/authentication.middleware.js"
import { Permission } from "../../../identity/domain/enums/permission.enum.js"
import { validate } from "../../../../shared/validation/validate.js"
import { createAddressSchema } from "../../validators/create-address.validator.js"
import { CreateAddressController } from "../controllers/create-address.controller.js"
import { AddressByCustomerController } from "../controllers/address-by-customer.controller.js"
import { AddressByIdController } from "../controllers/address-by-id.controller.js"
import { addressByIdParamsSchema } from "../../validators/address-by-id-params.validator.js"
import { AddressSetDefaultController } from "../controllers/address-set-default.controller.js"
import { AddressUpdateController } from "../controllers/address-update.controller.js"
import { addressUpdateSchema } from "../../validators/address-update.validator.js"
import { AddressDeleteController } from "../controllers/address-delete.controller.js"

const router = express.Router()

const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const authorizationMiddleware = container.resolve(AuthorizationMiddleware)

const createAddressController = container.resolve(CreateAddressController)
const addressByCustomerController = container.resolve(AddressByCustomerController)
const addressByIdController = container.resolve(AddressByIdController)
const addressSetDefaultController = container.resolve(AddressSetDefaultController)
const addressUpdateController = container.resolve(AddressUpdateController)
const addressDeleteController = container.resolve(AddressDeleteController)

router.route("/create-address").post(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.CUSTOMER_ADDRESS_CREATE), validate({ body: createAddressSchema }), createAddressController.handle.bind(createAddressController))

router.route("/all").get(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.CUSTOMER_ADDRESS_READ), addressByCustomerController.handle.bind(addressByCustomerController))

router.route("/:id").get(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.CUSTOMER_ADDRESS_READ), validate({ params: addressByIdParamsSchema }), addressByIdController.handle.bind(addressByIdController))

router.route("/:id").patch(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.CUSTOMER_ADDRESS_UPDATE), validate({ params: addressByIdParamsSchema }), addressSetDefaultController.handle.bind(addressSetDefaultController))

router.route("/:id").put(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.CUSTOMER_ADDRESS_UPDATE), validate({ params: addressByIdParamsSchema }), validate({ body: addressUpdateSchema }), addressUpdateController.handle.bind(addressUpdateController))

router.route("/:id").delete(authenticationMiddleware.authenticate, authorizationMiddleware.authorize(Permission.CUSTOMER_ADDRESS_UPDATE), validate({ params: addressByIdParamsSchema }), addressDeleteController.handle.bind(addressDeleteController))

export default router
