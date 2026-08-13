import { describe, expect, it } from "vitest";
import { Email } from "../../src/modules/identity/domain/value-objects/email.vo.js";
import { InvalidEmailError } from "../../src/modules/identity/domain/errors/index.js";

describe("Email Value Object", () => {
  describe("Validation", () => {
    it("should accept valid email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "a@b.c",
        "first.last@sub.domain.org",
      ];

      for (const email of validEmails) {
        expect(Email.isValid(email)).toBe(true);
        const emailVo = Email.create(email);
        expect(emailVo.getValue()).toBe(email.toLowerCase());
      }
    });

    it("should reject invalid email addresses", () => {
      const invalidEmails = [
        "invalid",
        "invalid@",
        "invalid@domain",
        "invalid@domain.",
        "invalid@.domain",
        "invalid@domain..com",
        "invalid@domain.com.",
        "invalid@domain.com@",
        "invalid @domain.com",
        "invalid@ domain.com",
        "invalid@domain .com",
      ];

      for (const email of invalidEmails) {
        expect(Email.isValid(email)).toBe(false);
        expect(() => Email.create(email)).toThrow(InvalidEmailError);
      }
    });
  });

  describe("ReDoS resilience", () => {
    it("should process long inputs quickly without catastrophic backtracking", () => {
      const longInput = "a@" + "a.".repeat(5000) + "a@";
      const start = performance.now();
      const isValid = Email.isValid(longInput);
      const end = performance.now();
      
      expect(isValid).toBe(false);
      expect(end - start).toBeLessThan(50); // Should be very fast (under 50ms)
    });
  });
});
