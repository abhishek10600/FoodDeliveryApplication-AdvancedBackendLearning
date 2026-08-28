import {
  PrismaClient,
  Prisma,
} from "../../generated/prisma/client.js";

import { Customer } from "../../src/modules/customer/domain/entities/index.js";

import {
  CustomerFirstName,
  CustomerLastName,
  CustomerPhoneNumber,
  CustomerAvatarUrl,
  CustomerPreferences,
} from "../../src/modules/customer/domain/value-objects/index.js";

import { createTestUser } from "./user.factory.js";

export function buildTestCustomer(params: {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string | null;
}): Customer {
  return Customer.create({
    userId: params.userId,
    firstName: CustomerFirstName.create(
      params.firstName ?? "John",
    ),
    lastName: CustomerLastName.create(
      params.lastName ?? "Doe",
    ),
    phone: CustomerPhoneNumber.create(
      params.phone ?? "9876543210",
    ),
    avatarUrl:
      params.avatarUrl
        ? CustomerAvatarUrl.create(
            params.avatarUrl,
          )
        : null,
    preferences: CustomerPreferences.default(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function createTestCustomer(
  prisma: PrismaClient,
  params?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string | null;
  },
): Promise<Customer> {
  const user = await createTestUser(prisma, {
    email:
      params?.email ??
      `customer-${crypto.randomUUID()}@example.com`,
  });

  const customer = buildTestCustomer({
    userId: user.getId(),
    firstName: params?.firstName,
    lastName: params?.lastName,
    phone: params?.phone,
    avatarUrl: params?.avatarUrl,
  });

  await prisma.customer.create({
    data: {
      id: customer.getId(),

      user: {
        connect: {
          id: customer.getUserId(),
        },
      },

      firstName: customer
        .getFirstName()
        .getValue(),

      lastName: customer
        .getLastName()
        .getValue(),

      phone: customer
        .getPhone()
        .getValue(),

      avatarUrl:
        customer
          .getAvatarUrl()
          ?.getValue() ?? null,

        preferences: {
          language: customer.getPreferences().getLanguage(),
          notifications: {
            push: customer.getPreferences().getNotifications().push,
            sms: customer.getPreferences().getNotifications().sms,
            email: customer.getPreferences().getNotifications().email,
          },
          marketing: {
            enabled: customer.getPreferences().getMarketing().enabled,
          },
        },

      createdAt: customer.getCreatedAt(),

      updatedAt: customer.getUpdatedAt(),
    },
  });

  return customer;
}
