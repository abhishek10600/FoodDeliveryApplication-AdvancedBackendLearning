import { injectable, inject } from "tsyringe"
import { IAddressRepository } from "../../../domain/repositories/address.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { Address } from "../../../domain/entities/address.entity.js";
import { AddressMapper } from "./mappers/address.mapper.js";

@injectable()
export class AddressRepository implements IAddressRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: {
        id
      }
    })

    if (!address) {
      return null
    }

    return AddressMapper.toDomain(address)
  }

  async findByCustomerId(customerId: string): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      where: {
        customerId
      }
    })

    return addresses.map((address) => AddressMapper.toDomain(address))
  }

  async findDefaultAddressByCustomerId(customerId: string): Promise<Address | null> {
    const address = await this.prisma.address.findFirst({
      where: {
        customerId,
        isDefault: true
      }
    })

    if (!address) {
      return null
    }

    return AddressMapper.toDomain(address)
  }

  async create(address: Address): Promise<Address> {
    const data = AddressMapper.toPersistence(address)

    const newAddress = await this.prisma.address.create({
      data
    })

    return AddressMapper.toDomain(newAddress)
  }

  async update(id: string, address: Address): Promise<void> {
    const data = AddressMapper.toUpdatePersistence(address)

    await this.prisma.address.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: {
        id
      }
    })
  }
}
