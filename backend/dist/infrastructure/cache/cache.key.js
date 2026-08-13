import { env } from "../../config/env.config.js";
const CACHE_PREFIX = env.CACHE_PREFIX;
const CACHE_VERSION = env.CACHE_VERSION;
const buildCacheKey = (...segments) => [CACHE_PREFIX, CACHE_VERSION, ...segments].join(":");
export const cacheKeys = {
    identity: {
        user: (userId) => buildCacheKey("identity", "user", userId),
        session: (sessionId) => buildCacheKey("identity", "session", sessionId)
    },
    customer: {
        profile: (customerId) => buildCacheKey("customer", "profile", customerId),
        address: (customerId) => buildCacheKey("customer", "address", customerId)
    },
    restaurant: {
        restaurant: (restaurantId) => buildCacheKey("restaurant", "restaurant", restaurantId),
        menu: (restaurantId) => buildCacheKey("restaurant", "menu", restaurantId)
    },
    ordering: {
        order: (orderId) => buildCacheKey("ordering", "order", orderId)
    },
    driver: {
        driver: (driverId) => buildCacheKey("driver", "driver", driverId)
    }
};
