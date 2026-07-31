import { CacheSerializationError } from "../../shared/errors/CacheSerializationError.js"

export class CacheSerializer {
  serialize<T>(value: T) {
    try {
      return JSON.stringify(value)
    } catch (error) {
      throw new CacheSerializationError("Failed to serialize the cache value", error)
    }
  }

  deserialize<T>(value: string) {
    try {
      return JSON.parse(value) as T
    } catch (error) {
      throw new CacheSerializationError("Failed to deserialize the cache value", error)
    }
  }
}

export const cacheSerializer = new CacheSerializer()
