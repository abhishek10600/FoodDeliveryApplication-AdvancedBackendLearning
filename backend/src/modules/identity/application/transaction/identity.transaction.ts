import { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";
import { IRefreshSessionRepository } from "../../domain/repositories/refresh-session.repository.js";
import { IUserRepository } from "../../domain/repositories/user.repository.js";

export interface IdentityTransactionContext {
  userRepository: IUserRepository;
  refreshSessionRepository: IRefreshSessionRepository;
  customerRepository: ICustomerRepository
}

export interface IIdentityTransaction {
  execute<T>(operation: (context: IdentityTransactionContext) => Promise<T>): Promise<T>
}
