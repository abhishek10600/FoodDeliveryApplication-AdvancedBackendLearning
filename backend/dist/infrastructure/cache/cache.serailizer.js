import { CacheSerializationError } from "../../shared/errors/CacheSerializationError.js";
export class CacheSerializer {
    serialize(value) {
        try {
            return JSON.stringify(value);
        }
        catch (error) {
            throw new CacheSerializationError("Failed to serialize the cache value", error);
        }
    }
    deserialize(value) {
        try {
            return JSON.parse(value);
        }
        catch (error) {
            throw new CacheSerializationError("Failed to deserialize the cache value", error);
        }
    }
}
export const cacheSerializer = new CacheSerializer();
