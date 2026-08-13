import { AppError } from "./AppError.js";

export class CacheSerializationError extends AppError {
  public readonly cause?: unknown;

  constructor(message: string = "Cache serialization/deserialization failed", cause?: unknown) {
    super(message, 500, "CACHE_SERIALIZATION_ERROR");
    this.cause = cause;
  }
}
