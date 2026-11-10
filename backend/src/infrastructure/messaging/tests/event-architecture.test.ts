import { describe, it, expect } from "vitest";
import { registerEvents } from "../events/register-events.js";
import { EventSerializer } from "../serialization/event.serializer.js";
import { EventDeserializer } from "../serialization/event.deserializer.js";
import { UserRegisteredV1 } from "../events/index.js";
import { createRootEventContext } from "../context/event-context.js"
import { createChildEventContext } from "../context/event-context.js"

describe("Event Architecture", () => {

  const registry = registerEvents();

  const serializer = new EventSerializer();

  const deserializer = new EventDeserializer(registry);

  const payload = {
    userId: "550e8400-e29b-41d4-a716-446655440000",
    email: "customer@example.com",
    roles: ["CUSTOMER"]
  };

  it("should serialize a valid event", () => {

    const serialized = serializer.serialize(
      UserRegisteredV1,
      payload,
      createRootEventContext(),
      "foodflow-api"
    );

    expect(typeof serialized).toBe("string");

    expect(JSON.parse(serialized).eventType)
      .toBe("identity.user-registered");
  });

  it("should deserialize a valid event", () => {

    const serialized = serializer.serialize(
      UserRegisteredV1,
      payload,
      createRootEventContext(),
      "foodflow-api"
    );

    const event = deserializer.deserialize(serialized);

    expect(event.eventType)
      .toBe("identity.user-registered");

    expect(event.payload).toEqual(payload);
  });

  it("should reject an invalid payload", () => {

    expect(() => {

      serializer.serialize(
        UserRegisteredV1,
        {
          userId: "invalid-id",
          email: "invalid-email",
          roles: ["CUSTOMER"]
        },
        createRootEventContext(),
        "foodflow-api"
      );

    }).toThrow();
  });

  it("should reject unsupported event versions", () => {

    const invalidEvent = JSON.stringify({
      id: "550e8400-e29b-41d4-a716-446655440000",
      eventType: "identity.user-registered",
      eventVersion: 99,
      occurredAt: new Date().toISOString(),
      producer: "foodflow-api",
      correlationId: "correlation-123",
      causationId: null,
      payload
    });

    expect(() => {
      deserializer.deserialize(invalidEvent);
    }).toThrow();
  });

  it("should preserve correlation ID and causation ID", () => {

    const parent = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      eventType: "ordering.order-placed",
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      producer: "foodflow-api",
      correlationId: "workflow-123",
      causationId: null,
      payload: {}
    };

    const childContext = createChildEventContext(parent);

    expect(childContext.correlationId).toBe("workflow-123");

    expect(childContext.causationId).toBe(parent.id);
  });

});
