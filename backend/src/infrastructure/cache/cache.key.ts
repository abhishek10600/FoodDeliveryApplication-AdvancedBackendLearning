import { env } from "../../config/env.config.js";

const CACHE_PREFIX = env.CACHE_PREFIX
const CACHE_VERSION = env.CACHE_VERSION

const buildCacheKey = (...segments: string[]) =>
  [CACHE_PREFIX, CACHE_VERSION, ...segments].join(":")

export const cacheKeys = {
  identity: {
    user: (userId: string) => buildCacheKey("identity", "user", userId),

    session: (sessionId: string) => buildCacheKey("identity", "session", sessionId)
  },

  customer: {
    profile: (customerId: string) => buildCacheKey("customer", "profile", customerId),

    address: (customerId: string) => buildCacheKey("customer", "address", customerId)
  },

  restaurant: {
    restaurant: (restaurantId: string) => buildCacheKey("restaurant", "restaurant", restaurantId),

    menu: (restaurantId: string) => buildCacheKey("restaurant", "menu", restaurantId)
  },

  ordering: {
    order: (orderId: string) => buildCacheKey("ordering", "order", orderId)
  },

  driver: {
    driver: (driverId: string) => buildCacheKey("driver", "driver", driverId)
  }
} as const

