import { describe, expect, it } from "vitest";
import { AuthenticationError } from "../../src/shared/errors/AuthenticationError.js";
import { AuthorizationError } from "../../src/shared/errors/AuthorizationError.js";
import { ConflictError } from "../../src/shared/errors/ConflictError.js";
import { InternalServerError } from "../../src/shared/errors/InternalServerError.js";
import { NotFoundError } from "../../src/shared/errors/NotFoundError.js";
import { ServiceUnavailableError } from "../../src/shared/errors/ServiceUnavailableError.js";
import { CacheSerializationError } from "../../src/shared/errors/CacheSerializationError.js";
import { BadRequestError } from "../../src/shared/errors/BadRequestError.js";

describe("Application Errors", () => {
  describe("AuthenticationError", () => {
    it("should use default message when none is provided", () => {
      const error = new AuthenticationError();
      expect(error.message).toBe("Authentication required");
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe("AUTHENTICATION_ERROR");
      expect(error.isOperational).toBe(true);
    });

    it("should use custom message when provided", () => {
      const error = new AuthenticationError("Custom message");
      expect(error.message).toBe("Custom message");
    });
  });

  describe("AuthorizationError", () => {
    it("should use default message when none is provided", () => {
      const error = new AuthorizationError();
      expect(error.message).toBe("Forbidden");
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe("AUTHORIZATION_ERROR");
      expect(error.isOperational).toBe(true);
    });

    it("should use custom message when provided", () => {
      const error = new AuthorizationError("Custom message");
      expect(error.message).toBe("Custom message");
    });
  });

  describe("ConflictError", () => {
    it("should use default message when none is provided", () => {
      const error = new ConflictError();
      expect(error.message).toBe("Conflict");
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe("CONFLICT");
      expect(error.isOperational).toBe(true);
    });

    it("should use custom message when provided", () => {
      const error = new ConflictError("Custom message");
      expect(error.message).toBe("Custom message");
    });
  });

  describe("InternalServerError", () => {
    it("should use default message when none is provided", () => {
      const error = new InternalServerError();
      expect(error.message).toBe("Internal server error");
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe("INTERNAL_SERVER_ERROR");
      expect(error.isOperational).toBe(true);
    });

    it("should use custom message when provided", () => {
      const error = new InternalServerError("Custom message");
      expect(error.message).toBe("Custom message");
    });
  });

  describe("NotFoundError", () => {
    it("should use default message when none is provided", () => {
      const error = new NotFoundError();
      expect(error.message).toBe("Resource Not Found");
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe("NOT FOUND");
      expect(error.isOperational).toBe(true);
    });

    it("should use custom message when provided", () => {
      const error = new NotFoundError("Custom message");
      expect(error.message).toBe("Custom message");
    });
  });

  describe("ServiceUnavailableError", () => {
    it("should use default message when none is provided", () => {
      const error = new ServiceUnavailableError();
      expect(error.message).toBe("Service temporarily unavailable");
      expect(error.statusCode).toBe(503);
      expect(error.code).toBe("SERVICE_UNAVAILABLE");
      expect(error.isOperational).toBe(true);
    });

    it("should use custom message when provided", () => {
      const error = new ServiceUnavailableError("Custom message");
      expect(error.message).toBe("Custom message");
    });
  });

  describe("CacheSerializationError", () => {
    it("should use default message when none is provided", () => {
      const error = new CacheSerializationError();
      expect(error.message).toBe("Cache serialization/deserialization failed");
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe("CACHE_SERIALIZATION_ERROR");
    });

    it("should use custom message when provided", () => {
      const error = new CacheSerializationError("Custom message");
      expect(error.message).toBe("Custom message");
    });

    it("should retain the cause property", () => {
      const cause = new Error("Underlying issue");
      const error = new CacheSerializationError("Serialization failed", cause);
      expect(error.cause).toBe(cause);
    });
  });

  describe("BadRequestError", () => {
    it("should require a custom message", () => {
      const error = new BadRequestError("Some bad request message");
      expect(error.message).toBe("Some bad request message");
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.isOperational).toBe(true);
    });
  });
});
