import { AppError } from "./AppError.js";
export class CacheSerializationError extends AppError {
    cause;
    constructor(message = "Cache serialization/deserialization failed", cause) {
        super(message, 500, "CACHE_SERIALIZATION_ERROR");
        this.cause = cause;
    }
}
