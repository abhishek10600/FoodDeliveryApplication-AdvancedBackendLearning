import { checkApiHealth } from "../../app/health.service.js"
import { checkRedisHealth } from "../cache/redis.health.js"
import { checkDatabaseHealth } from "../database/database.health.js"

export const getHealthStatus = async () => {

  const [api, database, redis] = await Promise.all([
    checkApiHealth(),
    checkDatabaseHealth(),
    checkRedisHealth()
  ])

  return {
    api,
    database,
    redis
  }
}
