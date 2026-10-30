import { Address } from "../entities/address.entity.js";

export interface IAddressRepository {
  findById(id: string): Promise<Address | null>
  findByCustomerId(customerId: string): Promise<Address[]>
  findDefaultAddressByCustomerId(customerId: string): Promise<Address | null>
  create(address: Address): Promise<Address>
  update(id: string, address: Address): Promise<void>
  delete(id: string): Promise<void>
}
