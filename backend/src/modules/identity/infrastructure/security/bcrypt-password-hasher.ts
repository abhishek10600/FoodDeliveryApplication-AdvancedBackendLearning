import { env } from "../../../../config/env.config.js";
import { IPasswordHasher } from "../../domain/services/password-hasher.js";
import bcrypt from "bcrypt"
import { PasswordHash } from "../../domain/value-objects/password-hash.vo.js";

export class BcryptPasswordHasher implements IPasswordHasher {

  async hashPassword(password: string): Promise<PasswordHash> {
    const hash = await bcrypt.hash(password, env.SALT_ROUNDS)

    return PasswordHash.create(hash)
  }

  async comparePassword(password: string, passwordHash: PasswordHash): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash.getValue())
  }
}
