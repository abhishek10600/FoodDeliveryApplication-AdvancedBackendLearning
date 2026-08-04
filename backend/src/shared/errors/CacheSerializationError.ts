import { AppError } from "./AppError.js";

export class CacheSerializationError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message = "Cache serialization/deserialization failed", 500, "CACHE_SERIALIZATION_ERROR")
    this.cause = cause
  }
}
