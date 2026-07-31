export const cacheTTL = {
  IDENTITY: {
    USER_PROFILE: 60 * 60, // 1 hour
    SESSION: 15 * 60 // 15 mins
  },

  CUSTOMER: {
    PROFILE: 60 * 60, // 1 hour
    ADDRESSES: 30 * 60 // 30 mins
  },

  RESTAURANT: {
    PROFILE: 60 * 60, // 1 hour
    MENU: 5 * 60, // 5 mins
  },

  ORDERING: {
    ORDER: 15    // 15 seconds
  },

  DRIVER: {
    PROFILE: 60, // 1 minute
    AVAILABILITY: 15 // 15 seconds
  }
} as const
