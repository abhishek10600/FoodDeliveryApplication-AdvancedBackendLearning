import { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";
import { IDriverVehicleRepository } from "../../../driver/domain/repositories/driver-vehicle.repository.js";
import { IDriverRepository } from "../../../driver/domain/repositories/driver.repository.js";
import { IRefreshSessionRepository } from "../../domain/repositories/refresh-session.repository.js";
import { IUserRepository } from "../../domain/repositories/user.repository.js";

export interface IdentityTransactionContext {
  userRepository: IUserRepository;
  refreshSessionRepository: IRefreshSessionRepository;
  customerRepository: ICustomerRepository;
  driverRepository: IDriverRepository;
  driverVehicleRepository: IDriverVehicleRepository;
}

export interface IIdentityTransaction {
  execute<T>(operation: (context: IdentityTransactionContext) => Promise<T>): Promise<T>
}
