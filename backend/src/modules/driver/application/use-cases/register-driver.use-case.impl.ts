import { injectable, inject } from "tsyringe"
import { DriverRegisterUseCase } from "./register-driver.use-case.js";
import { RegisterDriverResult } from "../dto/register-driver-result.dto.js";
import { RegisterDriverInput } from "../dto/register-driver.dto.js";
import { IdentityTokens } from "../../../identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IVerifyEmailRepository } from "../../../identity/domain/repositories/verify-email.repository.js";
import type { IPasswordHasher } from "../../../identity/domain/services/password-hasher.js";
import type { IJWTService } from "../../../identity/domain/services/jwt.service.js";
import type { ITokenHasher } from "../../../identity/domain/services/token-hasher.js";
import type { IIdentityTransaction } from "../../../identity/application/transaction/identity.transaction.js";
import type { IEmailJobQueue } from "../../../identity/application/services/email-job-queue.js";
import { Email } from "../../../identity/domain/value-objects/email.vo.js";
import { Driver } from "../../domain/entities/driver.entity.js";
import { TokenType } from "../../../identity/domain/enums/token-type.enum.js";
import { env } from "../../../../config/env.config.js";
import { EmailAlreadyRegisteredError } from "../../../identity/domain/errors/email-already-register.error.js";
import { RefreshSession } from "../../../identity/domain/entities/refresh-session.entity.js";
import { DriverProfile } from "../../domain/entities/driver-profile.entity.js";
import { DriverFirstName } from "../../domain/value-objects/driver-first-name.vo.js";
import { DriverLastName } from "../../domain/value-objects/driver-last-name.vo.js";
import { DriverPhone } from "../../domain/value-objects/driver-phone.vo.js";
import { DriverVehicle } from "../../domain/entities/driver-vehicle.entity.js";
import { DriverVehicleModel } from "../../domain/value-objects/driver-vehicle-model.vo.js";
import { DriverVehicleColor } from "../../domain/value-objects/driver-vehicle-color.vo.js";
import { DriverVehicleRegistrationNumber } from "../../domain/value-objects/driver-vehicle-registration-number.vo.js";
import { DriverVehicleMake } from "../../domain/value-objects/driver-vehicle-make.vo.js";
import { VerifyEmail } from "../../../identity/domain/entities/verify-email.entity.js";
import crypto from "node:crypto"

@injectable()
export class DriverRegisterUseCaseImpl implements DriverRegisterUseCase {
  constructor(

    @inject(IdentityTokens.VerifyEmailRepository)
    private readonly verifyEmailRepo: IVerifyEmailRepository,

    @inject(IdentityTokens.PasswordHasher)
    private readonly passwordHasher: IPasswordHasher,

    @inject(IdentityTokens.JwtService)
    private readonly jwtService: IJWTService,

    @inject(IdentityTokens.TokenHasher)
    private readonly tokenHasher: ITokenHasher,

    @inject(IdentityTokens.Transaction)
    private readonly transaction: IIdentityTransaction,

    @inject(IdentityTokens.EmailJobQueue)
    private readonly emailJobQueue: IEmailJobQueue

  ) { }

  async execute(input: RegisterDriverInput): Promise<RegisterDriverResult> {
    const email = Email.create(input.email)

    const passwordHash = await this.passwordHasher.hashPassword(input.password)

    const driver = Driver.create({
      email,
      passwordHash
    })

    const accessTokenIssuedAt = Math.floor(Date.now() / 1000)

    const accessToken = await this.jwtService.signAccessToken({
      sub: driver.getId(),
      roles: driver.getRoles(),
      type: TokenType.ACCESS,
      iat: accessTokenIssuedAt,
      exp: env.JWT_ACCESS_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE
    })

     const refreshTokenIssuedAt = Math.floor(Date.now() / 1000)

    const refreshToken = await this.jwtService.signRefreshToken({
      sub: driver.getId(),
      roles: driver.getRoles(),
      type: TokenType.REFRESH,
      iat: refreshTokenIssuedAt,
      exp: env.JWT_REFRESH_EXPIRES_IN,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE
    })

    const hashedRrefreshToken = this.tokenHasher.hash(refreshToken)

    const refreshSessionExpiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN * 1000)

    const newDriver = await this.transaction.execute(async ({
      userRepository,
      refreshSessionRepository,
      driverRepository,
      driverVehicleRepository
    }) => {
      const existingUser = await userRepository.existsByEmail(email)

      if (existingUser) {
        throw new EmailAlreadyRegisteredError()
      }

      const createdDriver = await userRepository.createDriver(driver)

      const refreshSession = RefreshSession.create({
        userId: createdDriver.getId(),
        familyId: crypto.randomUUID(),
        tokenHash: hashedRrefreshToken,
        expiresAt: refreshSessionExpiresAt,
        ipAddress: null,
        userAgent: null,
      }, crypto.randomUUID()
      );

      await refreshSessionRepository.create(refreshSession)

      const driverProfileEntity = DriverProfile.create({
        userId: createdDriver.getId(),
        firstName: DriverFirstName.create(input.firstName),
        lastName: DriverLastName.create(input.lastName),
        phone: DriverPhone.create(input.phone)
      })

      const createdDriverProfile = await driverRepository.create(driverProfileEntity)

      const driverVehicleEntity = DriverVehicle.create({
        driverId: createdDriverProfile.getId(),
        vehicleType: input.vehicleType,
        model: DriverVehicleModel.create(input.vehicleModel),
        color: DriverVehicleColor.create(input.vehicleColor),
        registrationNumber: DriverVehicleRegistrationNumber.create(input.vehicleRegNo),
        make: DriverVehicleMake.create(input.vehicleMake)
      })

      await driverVehicleRepository.create(driverVehicleEntity)

      return createdDriver;
    },
    )

    const rawEmailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationTokenHash = this.tokenHasher.hash(rawEmailVerificationToken)
    const verifyEmailTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const verifyEmail = VerifyEmail.create({
      userId: newDriver.getId(),
      tokenHash: emailVerificationTokenHash,
      expiresAt: verifyEmailTokenExpiresAt
    })

    await this.verifyEmailRepo.create(verifyEmail)

    const verificationUrl = `http://localhost:4000/api/v1/identity/verify-email/${rawEmailVerificationToken}`

    console.log({ verificationUrl })

    await this.emailJobQueue.enqueueVerificationEmail({
      userId: newDriver.getId(),
      email: newDriver.getEmail().getValue(),
      verificationUrl
    })

    return {
      driver: {
        id: newDriver.getId(),
        email: newDriver.getEmail().getValue(),
        roles: newDriver.getRoles(),
        status: newDriver.getStatus(),
        emailVerified: newDriver.isEmailVerified()
      },
      accessToken,
      refreshToken
    }

  }
}
