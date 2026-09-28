import { RestaurantDomainError } from "../../modules/restaurent/domain/errors/restaurant-domain.error.js";

export interface RestaurantCursor {
  name: string;
  id: string;
}

export const encodeRestaurantCursor = (cursor: RestaurantCursor): string => {
  const payload = JSON.stringify(cursor)

  return Buffer.from(payload, "utf-8").toString("base64url");
}

export const decodeRestaurantCursor = (cursor: string): RestaurantCursor => {
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf-8")

    const parsed: unknown = JSON.parse(decoded)

    if (typeof parsed !== "object" || parsed === null || !("name" in parsed) || !("id" in parsed) || typeof parsed.name !== "string" || typeof parsed.id !== "string") {
      throw new RestaurantDomainError("Invalid cursor structure", 400)
    }

    return {
      name: parsed.name,
      id: parsed.id
    }

  } catch {
    throw new RestaurantDomainError("Invalid pagination cursor", 400)
  }
}
