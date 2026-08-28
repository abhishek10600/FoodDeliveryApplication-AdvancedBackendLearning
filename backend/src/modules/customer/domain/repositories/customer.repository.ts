import { Customer } from "../entities/index.js";

export interface ICustomerRepository {

  findById(id: string): Promise<Customer | null>
  findByUserId(userId: string): Promise<Customer | null>
  create(customer: Customer): Promise<Customer>
  update(customer: Customer): Promise<Customer>

}
