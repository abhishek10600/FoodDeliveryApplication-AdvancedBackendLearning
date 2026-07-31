import { AppError } from "./AppError.js";

export class CacheSerializationError extends AppError {
  constructor(message: string, cause?: unknown) {

    super(message, 500, "CACHE SERIALIZATION ERROR")

    this.cause = cause
  }
}
