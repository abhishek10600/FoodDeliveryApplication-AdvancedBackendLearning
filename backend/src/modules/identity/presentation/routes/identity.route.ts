import express from "express"
import { container } from "tsyringe"
import { RegisterUserController } from "../controllers/register-user.controller.js"
import { validate } from "../../../../shared/validation/validate.js"
import { registerUserSchema } from "../../validators/register-user.validator.js"
import { loginUserSchema } from "../../validators/login-user.validator.js"
import { LoginUserController } from "../controllers/login-user.controller.js"
import { GetCurrentUserController } from "../controllers/get-current-user.controller.js"
import { AuthenticationMiddleware } from "../../../../app/middleware/authentication.middleware.js"

const router = express.Router()

const registerController = container.resolve(RegisterUserController)
const loginController = container.resolve(LoginUserController)
const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const getCurrentUserController = container.resolve(GetCurrentUserController)

router.route("/register").post(validate({ body: registerUserSchema }), registerController.handle.bind(registerController))

router.route("/login").post(validate({ body: loginUserSchema }), loginController.handle.bind(loginController))

router.route("/me").get(authenticationMiddleware.authenticate, getCurrentUserController.handle.bind(getCurrentUserController))

export default router;
