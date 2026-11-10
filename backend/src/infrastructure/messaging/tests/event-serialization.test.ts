import { describe, it, expect } from "vitest"
import { registerEvents } from "../events/register-events.js"
import { EventSerializer } from "../serialization/event.serializer.js"
import { EventDeserializer } from "../serialization/event.deserializer.js"
import { createRootEventContext } from "../context/event-context.js"

describe("Event serialization", () => {
  const registry = registerEvents()

  const serializer = new EventSerializer()
  const deserializer = new EventDeserializer(registry)

  it("should serialize and deserialize an integration event", () => {
    const context = createRootEventContext()

    const payload = {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      email: "customer@example.com",
      roles: ["CUSTOMER"] as const,
    }

    const definition = registry.get("identity.user-registered", 1)

    const serializedEvent = serializer.serialize(
      definition,
      payload,
      context,
      "foodflow-api")

    expect(typeof serializedEvent).toBe("string")

    const deserializedEvent = deserializer.deserialize(serializedEvent)

    expect(deserializedEvent.eventType).toBe("identity.user-registered");
    expect(deserializedEvent.eventVersion).toBe(1);
    expect(deserializedEvent.payload).toEqual(payload);
    expect(deserializedEvent.correlationId).toBe(context.correlationId);

  })
})
