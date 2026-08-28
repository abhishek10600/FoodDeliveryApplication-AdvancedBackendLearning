import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";

import { CustomerRepository } from "../../../src/modules/customer/infrastructure/persistence/prisma/customer.respository.js"

import { Customer } from "../../../src/modules/customer/domain/entities/index.js";

import {
  CustomerFirstName,
  CustomerLastName,
  CustomerPhoneNumber,
  CustomerAvatarUrl,
  CustomerPreferences,
} from "../../../src/modules/customer/domain/value-objects/index.js";

import {
  createTestCustomer,
  buildTestCustomer,
  createTestUser,
} from "../../factories/index.js";

describe("CustomerRepository Integration Tests", () => {
  let prisma: PrismaClient;
  let repository: CustomerRepository;

  // =========================================================
  // SETUP
  // =========================================================

  beforeAll(async () => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    prisma = new PrismaClient({
      adapter,
    });

    await prisma.$connect();

    repository = new CustomerRepository(prisma);
  });

  beforeEach(async () => {
    /*
     * Customer belongs to User.
     *
     * Users may also have other dependent records such as:
     *
     * RefreshSession
     * EmailVerification
     * PasswordReset
     *
     * Therefore those records must be removed before users.
     *
     * Customer itself is removed first because it is the
     * child of User.
     */

    await prisma.customer.deleteMany();

    await prisma.refreshSession.deleteMany();
    await prisma.emailVerification.deleteMany();
    await prisma.passwordReset.deleteMany();

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.customer.deleteMany();

    await prisma.refreshSession.deleteMany();
    await prisma.emailVerification.deleteMany();
    await prisma.passwordReset.deleteMany();

    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  // =========================================================
  // CREATE
  // =========================================================

  describe("create()", () => {
    it("should create a customer in the database", async () => {
      /*
       * Customer belongs to a User.
       *
       * Therefore we first create the parent User.
       */

      const user = await createTestUser(
        prisma,
        {
          email: "customer-create@example.com",
        },
      );

      const customer = buildTestCustomer({
        userId: user.getId(),
        firstName: "John",
        lastName: "Doe",
        phone: "9876543210",
      });

      const createdCustomer =
        await repository.create(customer);

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(createdCustomer).toBeInstanceOf(
        Customer,
      );

      expect(createdCustomer.getId()).toBe(
        customer.getId(),
      );

      expect(
        createdCustomer.getUserId(),
      ).toBe(user.getId());

      expect(
        createdCustomer
          .getFirstName()
          .getValue(),
      ).toBe("John");

      expect(
        createdCustomer
          .getLastName()
          .getValue(),
      ).toBe("Doe");

      expect(
        createdCustomer
          .getPhone()
          ?.getValue(),
      ).toBe("9876543210");

      expect(
        createdCustomer
          .getAvatarUrl(),
      ).toBeNull();

      expect(
        createdCustomer
          .getPreferences()
          .toPrimitives(),
      ).toEqual(
        customer
          .getPreferences()
          .toPrimitives(),
      );

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseCustomer =
        await prisma.customer.findUnique({
          where: {
            id: customer.getId(),
          },
        });

      expect(databaseCustomer).not.toBeNull();

      expect(databaseCustomer?.id).toBe(
        customer.getId(),
      );

      expect(databaseCustomer?.userId).toBe(
        user.getId(),
      );

      expect(
        databaseCustomer?.firstName,
      ).toBe("John");

      expect(
        databaseCustomer?.lastName,
      ).toBe("Doe");

      expect(
        databaseCustomer?.phone,
      ).toBe("9876543210");

      expect(
        databaseCustomer?.avatarUrl,
      ).toBeNull();

      expect(
        databaseCustomer?.preferences,
      ).toEqual(
        customer
          .getPreferences()
          .toPrimitives(),
      );
    });
  });

  // =========================================================
  // FIND BY ID
  // =========================================================

  describe("findById()", () => {
    it("should return the customer when the id exists", async () => {
      /*
       * The customer must already exist in the database.
       *
       * We use createTestCustomer() because this test is
       * about findById(), not create().
       */

      const customer =
        await createTestCustomer(
          prisma,
          {
            email:
              "customer-find-by-id@example.com",
          },
        );

      const foundCustomer =
        await repository.findById(
          customer.getId(),
        );

      expect(foundCustomer).not.toBeNull();

      expect(foundCustomer).toBeInstanceOf(
        Customer,
      );

      expect(foundCustomer?.getId()).toBe(
        customer.getId(),
      );

      expect(
        foundCustomer?.getUserId(),
      ).toBe(
        customer.getUserId(),
      );

      expect(
        foundCustomer
          ?.getFirstName()
          .getValue(),
      ).toBe(
        customer
          .getFirstName()
          .getValue(),
      );

      expect(
        foundCustomer
          ?.getLastName()
          .getValue(),
      ).toBe(
        customer
          .getLastName()
          .getValue(),
      );
    });

    it("should return null when the customer does not exist", async () => {
      const result =
        await repository.findById(
          crypto.randomUUID(),
        );

      expect(result).toBeNull();
    });
  });

  // =========================================================
  // FIND BY USER ID
  // =========================================================

  describe("findByUserId()", () => {
    it("should return the customer when the user id exists", async () => {
      const customer =
        await createTestCustomer(
          prisma,
          {
            email:
              "customer-find-by-user-id@example.com",
          },
        );

      const foundCustomer =
        await repository.findByUserId(
          customer.getUserId(),
        );

      expect(foundCustomer).not.toBeNull();

      expect(foundCustomer).toBeInstanceOf(
        Customer,
      );

      expect(foundCustomer?.getId()).toBe(
        customer.getId(),
      );

      expect(
        foundCustomer?.getUserId(),
      ).toBe(
        customer.getUserId(),
      );

      expect(
        foundCustomer
          ?.getFirstName()
          .getValue(),
      ).toBe(
        customer
          .getFirstName()
          .getValue(),
      );

      expect(
        foundCustomer
          ?.getLastName()
          .getValue(),
      ).toBe(
        customer
          .getLastName()
          .getValue(),
      );
    });

    it("should return null when the user has no customer", async () => {
      const user =
        await createTestUser(
          prisma,
          {
            email:
              "user-without-customer@example.com",
          },
        );

      const result =
        await repository.findByUserId(
          user.getId(),
        );

      expect(result).toBeNull();
    });
  });

  // =========================================================
  // UPDATE
  // =========================================================

  describe("update()", () => {
    it("should update the customer profile", async () => {
      const customer =
        await createTestCustomer(
          prisma,
          {
            email:
              "customer-profile-update@example.com",
            firstName: "John",
            lastName: "Doe",
            phone: "9876543210",
          },
        );

      customer.updateCustomerProfile({
        firstName:
          CustomerFirstName.create(
            "Michael",
          ),

        lastName:
          CustomerLastName.create(
            "Smith",
          ),

        phone:
          CustomerPhoneNumber.create(
            "9123456789",
          ),
      });

      const updatedCustomer =
        await repository.update(
          customer,
        );

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(updatedCustomer).toBeInstanceOf(
        Customer,
      );

      expect(
        updatedCustomer.getId(),
      ).toBe(
        customer.getId(),
      );

      expect(
        updatedCustomer
          .getFirstName()
          .getValue(),
      ).toBe("Michael");

      expect(
        updatedCustomer
          .getLastName()
          .getValue(),
      ).toBe("Smith");

      expect(
        updatedCustomer
          .getPhone()
          ?.getValue(),
      ).toBe("9123456789");

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseCustomer =
        await prisma.customer.findUnique({
          where: {
            id: customer.getId(),
          },
        });

      expect(databaseCustomer).not.toBeNull();

      expect(
        databaseCustomer?.firstName,
      ).toBe("Michael");

      expect(
        databaseCustomer?.lastName,
      ).toBe("Smith");

      expect(
        databaseCustomer?.phone,
      ).toBe("9123456789");
    });

    it("should update customer preferences", async () => {
      const customer =
        await createTestCustomer(
          prisma,
          {
            email:
              "customer-preferences-update@example.com",
          },
        );

      customer.updateLanguagePreference(
        "en",
      );

      customer.updateNotificationPreference({
        push: false,
        sms: true,
        email: false,
      });

      customer.updateMarketingPreference({
        enabled: true,
      });

      const updatedCustomer =
        await repository.update(
          customer,
        );

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(
        updatedCustomer
          .getPreferences()
          .toPrimitives(),
      ).toEqual({
        language: "en",

        notifications: {
          push: false,
          sms: true,
          email: false,
        },

        marketing: {
          enabled: true,
        },
      });

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseCustomer =
        await prisma.customer.findUnique({
          where: {
            id: customer.getId(),
          },
        });

      expect(databaseCustomer).not.toBeNull();

      expect(
        databaseCustomer?.preferences,
      ).toEqual({
        language: "en",

        notifications: {
          push: false,
          sms: true,
          email: false,
        },

        marketing: {
          enabled: true,
        },
      });
    });

    it("should update the customer avatar", async () => {
      const customer =
        await createTestCustomer(
          prisma,
          {
            email:
              "customer-avatar-update@example.com",
          },
        );

      customer.changeAvatarUrl(
        CustomerAvatarUrl.create(
          "https://example.com/avatar.jpg",
        ),
      );

      const updatedCustomer =
        await repository.update(
          customer,
        );

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(
        updatedCustomer
          .getAvatarUrl()
          ?.getValue(),
      ).toBe(
        "https://example.com/avatar.jpg",
      );

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseCustomer =
        await prisma.customer.findUnique({
          where: {
            id: customer.getId(),
          },
        });

      expect(databaseCustomer).not.toBeNull();

      expect(
        databaseCustomer?.avatarUrl,
      ).toBe(
        "https://example.com/avatar.jpg",
      );
    });
  });

  // =========================================================
  // UNIQUE USER ID CONSTRAINT
  // =========================================================

  describe("unique userId constraint", () => {
    it("should reject creating two customers for the same user", async () => {
      const user =
        await createTestUser(
          prisma,
          {
            email:
              "duplicate-customer-user@example.com",
          },
        );

      const firstCustomer =
        buildTestCustomer({
          userId: user.getId(),
          firstName: "John",
          lastName: "Doe",
        });

      const secondCustomer =
        buildTestCustomer({
          userId: user.getId(),
          firstName: "Jane",
          lastName: "Doe",
        });

      await repository.create(
        firstCustomer,
      );

      await expect(
        repository.create(
          secondCustomer,
        ),
      ).rejects.toMatchObject({
        code: "P2014",
      });

    });
  });

  // =========================================================
  // CASCADE DELETE
  // =========================================================

  describe("cascade delete", () => {
    it("should delete the customer when the user is deleted", async () => {
      const customer =
        await createTestCustomer(
          prisma,
          {
            email:
              "customer-cascade@example.com",
          },
        );

      // -----------------------------------------------------
      // Verify customer exists
      // -----------------------------------------------------

      const existingCustomer =
        await prisma.customer.findUnique({
          where: {
            id: customer.getId(),
          },
        });

      expect(existingCustomer).not.toBeNull();

      // -----------------------------------------------------
      // Delete parent User
      // -----------------------------------------------------

      await prisma.user.delete({
        where: {
          id: customer.getUserId(),
        },
      });

      // -----------------------------------------------------
      // Customer should be deleted automatically
      // -----------------------------------------------------

      const deletedCustomer =
        await prisma.customer.findUnique({
          where: {
            id: customer.getId(),
          },
        });

      expect(deletedCustomer).toBeNull();
    });
  });
});
