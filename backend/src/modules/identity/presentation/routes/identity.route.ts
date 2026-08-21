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
import { verifyEmailSchema } from "../../validators/verify-email.validator.js"
import { VerifyEmailController } from "../controllers/verify-email.controller.js"
import { forgotPasswordSchema } from "../../validators/forgot-password.validator.js"
import { ForgotPasswordController } from "../controllers/forgot-password.controller.js"
import { resetPasswordBodySchema, resetPasswordParamSchema } from "../../validators/reset-password.validator.js"
import { ResetPasswordController } from "../controllers/reset-password.controller.js"

const router = express.Router()

const registerController = container.resolve(RegisterUserController)
const loginController = container.resolve(LoginUserController)
const authenticationMiddleware = container.resolve(AuthenticationMiddleware)
const getCurrentUserController = container.resolve(GetCurrentUserController)
const refreshTokenController = container.resolve(RefreshTokenController)
const logoutController = container.resolve(LogoutController)
const changePasswordController = container.resolve(ChangePasswordController)
const verifyEmailController = container.resolve(VerifyEmailController)
const forgotPasswordController = container.resolve(ForgotPasswordController)
const resetPasswordController = container.resolve(ResetPasswordController)

router.route("/register").post(validate({ body: registerUserSchema }), registerController.handle.bind(registerController))

router.route("/login").post(validate({ body: loginUserSchema }), loginController.handle.bind(loginController))

router.route("/refresh").post(refreshTokenController.handle.bind(refreshTokenController))

router.route("/me").get(authenticationMiddleware.authenticate, getCurrentUserController.handle.bind(getCurrentUserController))

router.route("/logout").post(authenticationMiddleware.authenticate, logoutController.handle.bind(logoutController))

router.route("/change-password").patch(authenticationMiddleware.authenticate, validate({ body: changePasswordSchema }), changePasswordController.handle.bind(changePasswordController))

router.route("/verify-email/:token").get(authenticationMiddleware.authenticate, validate({ params: verifyEmailSchema }), verifyEmailController.handle.bind(verifyEmailController))

router.route("/forgot-password").post(validate({ body: forgotPasswordSchema }), forgotPasswordController.handle.bind(forgotPasswordController))

router.route("/reset-password/:token").put(validate({params: resetPasswordParamSchema, body: resetPasswordBodySchema}), resetPasswordController.handle.bind(resetPasswordController))

export default router;
