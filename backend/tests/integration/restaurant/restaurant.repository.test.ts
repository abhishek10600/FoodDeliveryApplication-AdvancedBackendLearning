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


import { RestaurantRepository } from "../../../src/modules/restaurent/infrastructure/persistence/prisma/restaurant.repository.js"

import { Restaurant } from "../../../src/modules/restaurent/domain/entities/index.js";

import { RestaurantName } from "../../../src/modules/restaurent/domain/value-objects/restaurant-name.vo.js";
import { RestaurantDescription } from "../../../src/modules/restaurent/domain/value-objects/restaurant-description.vo.js";
import { RestaurantPhone } from "../../../src/modules/restaurent/domain/value-objects/restaurant-phone.vo.js";
import { RestaurantEmail } from "../../../src/modules/restaurent/domain/value-objects/restaurant-email.vo.js";
import { RestaurantOpeningHours } from "../../../src/modules/restaurent/domain/value-objects/restaurnat-opening-hours.vo.js";

import { DayOfWeek } from "../../../src/modules/restaurent/domain/enums/restaurnat-opening-hours.enum.js";
import { RestaurantStatus } from "../../../src/modules/restaurent/domain/enums/restaurant-status.enum.js";

import {
  createTestUser,
} from "../../factories/index.js";
import { Role } from "../../../src/modules/identity/domain/enums/role.enum.js";

describe("RestaurantRepository Integration Tests", () => {
  let prisma: PrismaClient;
  let repository: RestaurantRepository;

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

    repository = new RestaurantRepository(prisma);
  });

  beforeEach(async () => {
    /*
     * Restaurant has dependent records:
     *
     * RestaurantCuisine
     * RestaurantOpeningHours
     *
     * Therefore child records must be removed before
     * deleting Restaurants.
     *
     * Restaurant belongs to User.
     *
     * Therefore Users must be deleted last.
     */

    // await prisma.restaurantCuisin.deleteMany();
    await prisma.restaurantCuisines.deleteMany()
    await prisma.restaurantOpeningHours.deleteMany();

    await prisma.restaurant.deleteMany();

    await prisma.cuisine.deleteMany();

    await prisma.refreshSession.deleteMany();
    await prisma.emailVerification.deleteMany();
    await prisma.passwordReset.deleteMany();

    await prisma.customer.deleteMany();

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.restaurantCuisines.deleteMany();
    await prisma.restaurantOpeningHours.deleteMany();

    await prisma.restaurant.deleteMany();

    await prisma.cuisine.deleteMany();

    await prisma.refreshSession.deleteMany();
    await prisma.emailVerification.deleteMany();
    await prisma.passwordReset.deleteMany();

    await prisma.customer.deleteMany();

    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  // =========================================================
  // CREATE
  // =========================================================

  describe("create()", () => {
    it("should create a restaurant in the database", async () => {
      /*
       * Restaurant belongs to a User.
       *
       * Therefore we first create the restaurant owner.
       */

      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-create@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "The Food House",
        ),

        description:
          RestaurantDescription.create(
            "A test restaurant",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "foodhouse@example.com",
          ),
      });

      const createdRestaurant =
        await repository.create(
          restaurant,
        );

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(createdRestaurant).toBeInstanceOf(
        Restaurant,
      );

      expect(
        createdRestaurant.getId(),
      ).toBe(
        restaurant.getId(),
      );

      expect(
        createdRestaurant.getOwnerId(),
      ).toBe(
        owner.getId(),
      );

      expect(
        createdRestaurant
          .getName()
          .getValue(),
      ).toBe("The Food House");

      expect(
        createdRestaurant
          .getDescription()
          .getValue(),
      ).toBe("A test restaurant");

      expect(
        createdRestaurant
          .getPhone()
          .getValue(),
      ).toBe("9876543210");

      expect(
        createdRestaurant
          .getEmail()
          .getValue(),
      ).toBe(
        "foodhouse@example.com",
      );

      expect(
        createdRestaurant.getStatus(),
      ).toBe(
        RestaurantStatus.PENDING,
      );

      expect(
        createdRestaurant
          .getCuisines(),
      ).toHaveLength(0);

      expect(
        createdRestaurant
          .getOpeningHours(),
      ).toHaveLength(0);

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseRestaurant =
        await prisma.restaurant.findUnique({
          where: {
            id: restaurant.getId(),
          },
        });

      expect(
        databaseRestaurant,
      ).not.toBeNull();

      expect(
        databaseRestaurant?.id,
      ).toBe(
        restaurant.getId(),
      );

      expect(
        databaseRestaurant?.ownerId,
      ).toBe(
        owner.getId(),
      );

      expect(
        databaseRestaurant?.name,
      ).toBe(
        "The Food House",
      );

      expect(
        databaseRestaurant?.description,
      ).toBe(
        "A test restaurant",
      );

      expect(
        databaseRestaurant?.phone,
      ).toBe(
        "9876543210",
      );

      expect(
        databaseRestaurant?.email,
      ).toBe(
        "foodhouse@example.com",
      );

      expect(
        databaseRestaurant?.status,
      ).toBe(
        RestaurantStatus.PENDING,
      );
    });

    it("should persist cuisines and opening hours when creating a restaurant", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-relations@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      // -----------------------------------------------------
      // Create cuisines
      // -----------------------------------------------------

      const indianCuisine =
        await prisma.cuisine.create({
          data: {
            name: "Indian",
            slug: "indian",
          },
        });

      const italianCuisine =
        await prisma.cuisine.create({
          data: {
            name: "Italian",
            slug: "italian",
          },
        });

      // -----------------------------------------------------
      // Build restaurant
      // -----------------------------------------------------

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Food Paradise",
        ),

        description:
          RestaurantDescription.create(
            "Multi cuisine restaurant",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "paradise@example.com",
          ),
      });

      restaurant.addCuisine(
        indianCuisine.id,
      );

      restaurant.addCuisine(
        italianCuisine.id,
      );

      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: DayOfWeek.MONDAY,
          opensAt: "10:00",
          closesAt: "22:00",
          isClosed: false,
        }),
      );

      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: DayOfWeek.TUESDAY,
          opensAt: "10:00",
          closesAt: "22:00",
          isClosed: false,
        }),
      );

      const createdRestaurant =
        await repository.create(
          restaurant,
        );

      // -----------------------------------------------------
      // Domain object
      // -----------------------------------------------------

      expect(
        createdRestaurant
          .getCuisines(),
      ).toHaveLength(2);

      expect(
        createdRestaurant
          .getCuisines()
          .map(
            (cuisine) =>
              cuisine.getCuisineId(),
          ),
      ).toEqual(
        expect.arrayContaining([
          indianCuisine.id,
          italianCuisine.id,
        ]),
      );

      expect(
        createdRestaurant
          .getOpeningHours(),
      ).toHaveLength(2);

      const monday =
        createdRestaurant
          .getOpeningHours()
          .find(
            (hours) =>
              hours.getDayOfWeek() ===
              DayOfWeek.MONDAY,
          );

      expect(monday).toBeDefined();

      expect(
        monday?.getOpensAt(),
      ).toBe("10:00");

      expect(
        monday?.getClosesAt(),
      ).toBe("22:00");

      expect(
        monday?.getIsClosed(),
      ).toBe(false);

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseRestaurant =
        await prisma.restaurant.findUnique({
          where: {
            id: restaurant.getId(),
          },

          include: {
            cuisines: true,
            openingHours: true,
          },
        });

      expect(
        databaseRestaurant,
      ).not.toBeNull();

      expect(
        databaseRestaurant
          ?.cuisines,
      ).toHaveLength(2);

      expect(
        databaseRestaurant
          ?.openingHours,
      ).toHaveLength(2);

      expect(
        databaseRestaurant
          ?.cuisines
          .map(
            (cuisine) =>
              cuisine.cuisineId,
          ),
      ).toEqual(
        expect.arrayContaining([
          indianCuisine.id,
          italianCuisine.id,
        ]),
      );
    });
  });

  // =========================================================
  // FIND BY ID
  // =========================================================

  describe("findById()", () => {
    it("should return the restaurant when the id exists", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-find-id@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Find Me Restaurant",
        ),

        description:
          RestaurantDescription.create(
            "Restaurant used for findById test",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "findme@example.com",
          ),
      });

      await repository.create(
        restaurant,
      );

      const foundRestaurant =
        await repository.findById(
          restaurant.getId(),
        );

      // -----------------------------------------------------
      // Assertions
      // -----------------------------------------------------

      expect(
        foundRestaurant,
      ).not.toBeNull();

      expect(
        foundRestaurant,
      ).toBeInstanceOf(
        Restaurant,
      );

      expect(
        foundRestaurant?.getId(),
      ).toBe(
        restaurant.getId(),
      );

      expect(
        foundRestaurant?.getOwnerId(),
      ).toBe(
        owner.getId(),
      );

      expect(
        foundRestaurant
          ?.getName()
          .getValue(),
      ).toBe(
        "Find Me Restaurant",
      );

      expect(
        foundRestaurant
          ?.getDescription()
          .getValue(),
      ).toBe(
        "Restaurant used for findById test",
      );

      expect(
        foundRestaurant
          ?.getPhone()
          .getValue(),
      ).toBe(
        "9876543210",
      );

      expect(
        foundRestaurant
          ?.getEmail()
          .getValue(),
      ).toBe(
        "findme@example.com",
      );

      expect(
        foundRestaurant?.getStatus(),
      ).toBe(
        RestaurantStatus.PENDING,
      );
    });

    it("should return null when the restaurant does not exist", async () => {
      const result =
        await repository.findById(
          crypto.randomUUID(),
        );

      expect(result).toBeNull();
    });

    it("should rehydrate cuisines and opening hours", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-rehydrate@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const cuisine =
        await prisma.cuisine.create({
          data: {
            name: "Mexican",
            slug: "mexican",
          },
        });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Mexican Kitchen",
        ),

        description:
          RestaurantDescription.create(
            "Mexican restaurant",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "mexican@example.com",
          ),
      });

      restaurant.addCuisine(
        cuisine.id,
      );

      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: DayOfWeek.FRIDAY,
          opensAt: "18:00",
          closesAt: "02:00",
          isClosed: false,
        }),
      );

      await repository.create(
        restaurant,
      );

      const foundRestaurant =
        await repository.findById(
          restaurant.getId(),
        );

      expect(
        foundRestaurant,
      ).not.toBeNull();

      expect(
        foundRestaurant
          ?.getCuisines(),
      ).toHaveLength(1);

      expect(
        foundRestaurant
          ?.getCuisines()[0]
          .getCuisineId(),
      ).toBe(
        cuisine.id,
      );

      expect(
        foundRestaurant
          ?.getOpeningHours(),
      ).toHaveLength(1);

      const friday =
        foundRestaurant
          ?.getOpeningHours()
          .find(
            (hours) =>
              hours.getDayOfWeek() ===
              DayOfWeek.FRIDAY,
          );

      expect(friday).toBeDefined();

      expect(
        friday?.getOpensAt(),
      ).toBe("18:00");

      expect(
        friday?.getClosesAt(),
      ).toBe("02:00");

      expect(
        friday?.isOvernight(),
      ).toBe(true);
    });
  });

  // =========================================================
  // FIND BY OWNER ID
  // =========================================================

  describe("findByOwnerId()", () => {
    it("should return all restaurants belonging to the owner", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-find-all@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurantOne =
        Restaurant.create({
          ownerId: owner.getId(),

          name: RestaurantName.create(
            "Restaurant One",
          ),

          description:
            RestaurantDescription.create(
              "First restaurant",
            ),

          phone:
            RestaurantPhone.create(
              "9876543210",
            ),

          email:
            RestaurantEmail.create(
              "one@example.com",
            ),
        });

      const restaurantTwo =
        Restaurant.create({
          ownerId: owner.getId(),

          name: RestaurantName.create(
            "Restaurant Two",
          ),

          description:
            RestaurantDescription.create(
              "Second restaurant",
            ),

          phone:
            RestaurantPhone.create(
              "9123456789",
            ),

          email:
            RestaurantEmail.create(
              "two@example.com",
            ),
        });

      await repository.create(
        restaurantOne,
      );

      await repository.create(
        restaurantTwo,
      );

      const restaurants =
        await repository.findByOwnerId(
          owner.getId(),
        );

      // -----------------------------------------------------
      // Assertions
      // -----------------------------------------------------

      expect(restaurants).toHaveLength(2);

      expect(
        restaurants.every(
          (restaurant) =>
            restaurant instanceof Restaurant,
        ),
      ).toBe(true);

      expect(
        restaurants.map(
          (restaurant) =>
            restaurant.getId(),
        ),
      ).toEqual(
        expect.arrayContaining([
          restaurantOne.getId(),
          restaurantTwo.getId(),
        ]),
      );
    });

    it("should return an empty array when the owner has no restaurants", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "owner-without-restaurants@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurants =
        await repository.findByOwnerId(
          owner.getId(),
        );

      expect(restaurants).toEqual([]);
    });

    it("should return only restaurants belonging to the requested owner", async () => {
      const ownerOne =
        await createTestUser(
          prisma,
          {
            email:
              "restaurant-owner-one@example.com",

            roles: [Role.RESTAURANT_OWNER],
          },
        );

      const ownerTwo =
        await createTestUser(
          prisma,
          {
            email:
              "restaurant-owner-two@example.com",

            roles: [Role.RESTAURANT_OWNER],
          },
        );

      const restaurantOne =
        Restaurant.create({
          ownerId:
            ownerOne.getId(),

          name:
            RestaurantName.create(
              "Owner One Restaurant",
            ),

          description:
            RestaurantDescription.create(
              "Owner one restaurant",
            ),

          phone:
            RestaurantPhone.create(
              "9876543210",
            ),

          email:
            RestaurantEmail.create(
              "ownerone@example.com",
            ),
        });

      const restaurantTwo =
        Restaurant.create({
          ownerId:
            ownerTwo.getId(),

          name:
            RestaurantName.create(
              "Owner Two Restaurant",
            ),

          description:
            RestaurantDescription.create(
              "Owner two restaurant",
            ),

          phone:
            RestaurantPhone.create(
              "9123456789",
            ),

          email:
            RestaurantEmail.create(
              "ownertwo@example.com",
            ),
        });

      await repository.create(
        restaurantOne,
      );

      await repository.create(
        restaurantTwo,
      );

      const restaurants =
        await repository.findByOwnerId(
          ownerOne.getId(),
        );

      expect(restaurants).toHaveLength(1);

      expect(
        restaurants[0].getId(),
      ).toBe(
        restaurantOne.getId(),
      );

      expect(
        restaurants[0].getOwnerId(),
      ).toBe(
        ownerOne.getId(),
      );
    });
  });

  // =========================================================
  // UPDATE
  // =========================================================

  describe("update()", () => {
    it("should update the restaurant profile", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-update@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Old Restaurant Name",
        ),

        description:
          RestaurantDescription.create(
            "Old description",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "old@example.com",
          ),
      });

      await repository.create(
        restaurant,
      );

      restaurant.updateProfile({
        name:
          RestaurantName.create(
            "New Restaurant Name",
          ),

        description:
          RestaurantDescription.create(
            "New description",
          ),

        phone:
          RestaurantPhone.create(
            "9123456789",
          ),

        email:
          RestaurantEmail.create(
            "new@example.com",
          ),
      });

      await repository.update(
        restaurant,
      );

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const databaseRestaurant =
        await prisma.restaurant.findUnique({
          where: {
            id: restaurant.getId(),
          },
        });

      expect(
        databaseRestaurant,
      ).not.toBeNull();

      expect(
        databaseRestaurant?.name,
      ).toBe(
        "New Restaurant Name",
      );

      expect(
        databaseRestaurant?.description,
      ).toBe(
        "New description",
      );

      expect(
        databaseRestaurant?.phone,
      ).toBe(
        "9123456789",
      );

      expect(
        databaseRestaurant?.email,
      ).toBe(
        "new@example.com",
      );
    });

    it("should persist restaurant status changes", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-status@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Status Restaurant",
        ),

        description:
          RestaurantDescription.create(
            "Restaurant status test",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "status@example.com",
          ),
      });

      await repository.create(
        restaurant,
      );

      restaurant.activate();

      await repository.update(
        restaurant,
      );

      const databaseRestaurant =
        await prisma.restaurant.findUnique({
          where: {
            id: restaurant.getId(),
          },
        });

      expect(
        databaseRestaurant?.status,
      ).toBe(
        RestaurantStatus.ACTIVE,
      );
    });

    it("should update restaurant cuisines", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-cuisine-update@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const indianCuisine =
        await prisma.cuisine.create({
          data: {
            name: "Indian",
            slug: "indian",
          },
        });

      const italianCuisine =
        await prisma.cuisine.create({
          data: {
            name: "Italian",
            slug: "italian",
          },
        });

      const chineseCuisine =
        await prisma.cuisine.create({
          data: {
            name: "Chinese",
            slug: "chinese",
          },
        });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Cuisine Restaurant",
        ),

        description:
          RestaurantDescription.create(
            "Cuisine update test",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "cuisine@example.com",
          ),
      });

      restaurant.addCuisine(
        indianCuisine.id,
      );

      restaurant.addCuisine(
        italianCuisine.id,
      );

      await repository.create(
        restaurant,
      );

      // -----------------------------------------------------
      // Change cuisines
      // -----------------------------------------------------

      restaurant.removeCuisine(
        italianCuisine.id,
      );

      restaurant.addCuisine(
        chineseCuisine.id,
      );

      await repository.update(
        restaurant,
      );

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const cuisines =
        await prisma.restaurantCuisines.findMany({
          where: {
            restaurantId:
              restaurant.getId(),
          },

          orderBy: {
            cuisineId: "asc",
          },
        });

      expect(cuisines).toHaveLength(2);

      expect(
        cuisines.map(
          (cuisine) =>
            cuisine.cuisineId,
        ),
      ).toEqual(
        expect.arrayContaining([
          indianCuisine.id,
          chineseCuisine.id,
        ]),
      );

      expect(
        cuisines.some(
          (cuisine) =>
            cuisine.cuisineId ===
            italianCuisine.id,
        ),
      ).toBe(false);
    });

    it("should update restaurant opening hours", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-hours-update@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Opening Hours Restaurant",
        ),

        description:
          RestaurantDescription.create(
            "Opening hours update test",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "hours@example.com",
          ),
      });

      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: DayOfWeek.MONDAY,
          opensAt: "10:00",
          closesAt: "20:00",
          isClosed: false,
        }),
      );

      await repository.create(
        restaurant,
      );

      // -----------------------------------------------------
      // Change Monday hours
      // -----------------------------------------------------

      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: DayOfWeek.MONDAY,
          opensAt: "09:00",
          closesAt: "22:00",
          isClosed: false,
        }),
      );

      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: DayOfWeek.SUNDAY,
          isClosed: true,
        }),
      );

      await repository.update(
        restaurant,
      );

      // -----------------------------------------------------
      // Database
      // -----------------------------------------------------

      const openingHours =
        await prisma.restaurantOpeningHours.findMany({
          where: {
            restaurantId:
              restaurant.getId(),
          },

          orderBy: {
            dayOfWeek: "asc",
          },
        });

      expect(openingHours).toHaveLength(2);

      const monday =
        openingHours.find(
          (hours) =>
            hours.dayOfWeek ===
            DayOfWeek.MONDAY,
        );

      expect(monday).toBeDefined();

      expect(
        monday?.opensAt,
      ).toBe("09:00");

      expect(
        monday?.closesAt,
      ).toBe("22:00");

      expect(
        monday?.isClosed,
      ).toBe(false);

      const sunday =
        openingHours.find(
          (hours) =>
            hours.dayOfWeek ===
            DayOfWeek.SUNDAY,
        );

      expect(sunday).toBeDefined();

      expect(
        sunday?.opensAt,
      ).toBeNull();

      expect(
        sunday?.closesAt,
      ).toBeNull();

      expect(
        sunday?.isClosed,
      ).toBe(true);
    });

    it("should remove cuisines when they are removed from the aggregate", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-cuisine-remove@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const indianCuisine =
        await prisma.cuisine.create({
          data: {
            name: "Indian",
            slug: "indian",
          },
        });

      const italianCuisine =
        await prisma.cuisine.create({
          data: {
            name: "Italian",
            slug: "italian",
          },
        });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Cuisine Removal Restaurant",
        ),

        description:
          RestaurantDescription.create(
            "Cuisine removal test",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "remove@example.com",
          ),
      });

      restaurant.addCuisine(
        indianCuisine.id,
      );

      restaurant.addCuisine(
        italianCuisine.id,
      );

      await repository.create(
        restaurant,
      );

      restaurant.removeCuisine(
        italianCuisine.id,
      );

      await repository.update(
        restaurant,
      );

      const cuisines =
        await prisma.restaurantCuisines.findMany({
          where: {
            restaurantId:
              restaurant.getId(),
          },
        });

      expect(cuisines).toHaveLength(1);

      expect(
        cuisines[0].cuisineId,
      ).toBe(
        indianCuisine.id,
      );
    });

    it("should remove opening hours when they are removed from the aggregate", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-hours-remove@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Hours Removal Restaurant",
        ),

        description:
          RestaurantDescription.create(
            "Opening hours removal test",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "hours-remove@example.com",
          ),
      });

      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: DayOfWeek.MONDAY,
          opensAt: "10:00",
          closesAt: "20:00",
          isClosed: false,
        }),
      );

      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: DayOfWeek.TUESDAY,
          opensAt: "10:00",
          closesAt: "20:00",
          isClosed: false,
        }),
      );

      await repository.create(
        restaurant,
      );

      restaurant.removeOpeningHours(
        DayOfWeek.TUESDAY,
      );

      await repository.update(
        restaurant,
      );

      const openingHours =
        await prisma.restaurantOpeningHours.findMany({
          where: {
            restaurantId:
              restaurant.getId(),
          },
        });

      expect(
        openingHours,
      ).toHaveLength(1);

      expect(
        openingHours[0].dayOfWeek,
      ).toBe(
        DayOfWeek.MONDAY,
      );
    });
  });

  // =========================================================
  // RELATIONSHIP CONSTRAINTS
  // =========================================================

  describe("relationship constraints", () => {
    it("should not allow creating a restaurant for a non-existent owner", async () => {
      const restaurant = Restaurant.create({
        ownerId: crypto.randomUUID(),

        name: RestaurantName.create(
          "Invalid Owner Restaurant",
        ),

        description:
          RestaurantDescription.create(
            "Invalid owner test",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "invalid-owner@example.com",
          ),
      });

      await expect(
        repository.create(
          restaurant,
        ),
      ).rejects.toThrow();
    });

    it("should not allow using a non-existent cuisine", async () => {
      const owner = await createTestUser(prisma, {
        email:
          "restaurant-owner-invalid-cuisine@example.com",

        roles: [Role.RESTAURANT_OWNER],
      });

      const restaurant = Restaurant.create({
        ownerId: owner.getId(),

        name: RestaurantName.create(
          "Invalid Cuisine Restaurant",
        ),

        description:
          RestaurantDescription.create(
            "Invalid cuisine test",
          ),

        phone:
          RestaurantPhone.create(
            "9876543210",
          ),

        email:
          RestaurantEmail.create(
            "invalid-cuisine@example.com",
          ),
      });

      restaurant.addCuisine(
        crypto.randomUUID(),
      );

      await expect(
        repository.create(
          restaurant,
        ),
      ).rejects.toThrow();
    });
  });
});
