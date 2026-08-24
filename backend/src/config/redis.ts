import { Redis } from "ioredis";

import { env } from "./env.config.js";

export const redisConnection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  lazyConnect: true,
  maxRetriesPerRequest: null,
  enableReadyCheck: true
};

const redis = new Redis(redisConnection);

export default redis;
