import express from "express"
import { container } from "tsyringe"
import { RegisterUserController } from "../controllers/register-user.controller.js"
import { validate } from "../../../../shared/validation/validate.js"
import { registerUserSchema } from "../../validators/register-user.validator.js"
import { loginUserSchema } from "../../validators/login-user.validator.js"
import { LoginUserController } from "../controllers/login-user.controller.js"
import { GetCurrentUserController } from "../controllers/get-current-user.controller.js"
import { AuthenticationMiddleware } from "../../../../app/middleware/authentication.middleware.js"
import { RefreshTokenController } from "../controllers/refresh-token.controller.js"
import { LogoutController } from "../controllers/logout-user.controller.js"
import { changePasswordSchema } from "../../validators/change-password.validator.js"
import { ChangePasswordController } from "../controllers/change-password.controller.js"

const router = express.Router()

const registerController = container.resolve(RegisterUserController)
const loginController = container.resolve(LoginUserController)
const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const getCurrentUserController = container.resolve(GetCurrentUserController)
const refreshTokenController = container.resolve(RefreshTokenController)
const logoutController = container.resolve(LogoutController)
const changePasswordController = container.resolve(ChangePasswordController)

router.route("/register").post(validate({ body: registerUserSchema }), registerController.handle.bind(registerController))

router.route("/login").post(validate({ body: loginUserSchema }), loginController.handle.bind(loginController))

router.route("/refresh").post(refreshTokenController.handle.bind(refreshTokenController))

router.route("/me").get(authenticationMiddleware.authenticate, getCurrentUserController.handle.bind(getCurrentUserController))

router.route("/logout").post(authenticationMiddleware.authenticate, logoutController.handle.bind(logoutController))

router.route("/change-password").patch(authenticationMiddleware.authenticate, validate({body: changePasswordSchema}), changePasswordController.handle.bind(changePasswordController))

export default router;
