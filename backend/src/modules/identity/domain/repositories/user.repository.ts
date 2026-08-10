import { User } from "../entities/user.entity.js";
import { Email } from "../value-objects/email.vo.js";

export interface UserRepository {
  create(user: User): Promise<User>

  findById(id: string): Promise<User | null>

  findByEmail(email: Email): Promise<User | null>

  existsByEmail(email: Email): Promise<boolean>

  update(user: User): Promise<User>

}
