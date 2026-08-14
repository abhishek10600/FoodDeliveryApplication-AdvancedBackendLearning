import { IRefreshSessionRepository } from "../../domain/repositories/refresh-session.repository.js";
import { IUserRepository } from "../../domain/repositories/user.repository.js";

export interface IdentityTransactionContext {
  userRepository: IUserRepository;
  refreshSessionRepository: IRefreshSessionRepository;
}

export interface IIdentityTransaction {
  execute<T>(operation: (context: IdentityTransactionContext) => Promise<T>): Promise<T>
}
