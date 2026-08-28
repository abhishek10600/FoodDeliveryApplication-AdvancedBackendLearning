import { injectable, inject } from "tsyringe";
import { ICustomerRepository } from "../../../domain/repositories/customer.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { Customer } from "../../../domain/entities/customer.entity.js";
import { CustomerMapper } from "./mappers/customer.mapper.js";

@injectable()
export class CustomerRepository implements ICustomerRepository {

  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id
      }
    })

    if (!customer) {
      return null
    }

    return CustomerMapper.toDomain(customer)
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        userId
      }
    })

    if (!customer) {
      return null
    }

    return CustomerMapper.toDomain(customer)
  }

  async create(customer: Customer): Promise<Customer> {
    const data = CustomerMapper.toPersistence(customer)

    const newCustomer = await this.prisma.customer.create({
      data
    })

    return CustomerMapper.toDomain(newCustomer)

  }

  async update(customer: Customer): Promise<Customer> {
    const data = CustomerMapper.toUpdatePersistence(customer)

    const updateCustomer = await this.prisma.customer.update({
      where: {
        id: customer.getId()
      },
      data
    })

    return CustomerMapper.toDomain(updateCustomer)
  }

}
