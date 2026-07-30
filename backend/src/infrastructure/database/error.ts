import { Prisma } from "../../../generated/prisma/client.js"
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { ServiceUnavailableError } from "../../shared/errors/ServiceUnavailableError.js";

export const translatePrismaError = (error: unknown): never => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw error;
  }

  switch (error.code) {
    case "P2002":
          throw new ConflictError("Resource already exists.");

        case "P2025":
          throw new NotFoundError("Requested resource was not found.");

        case "P2003":
          throw new ConflictError("Operation violates a database constraint.");

        case "P2024":
          throw new ServiceUnavailableError("Database temporarily unavailable.");

        default:
          throw error;
  }
}
