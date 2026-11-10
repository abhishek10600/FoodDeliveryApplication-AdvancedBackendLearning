import { EventEnvelope } from "../contracts/event-envelope.js";
import { EventRegistry } from "../events/event-registry.js";
import { EventDeserializationError, EventValidationError } from "./event.errors.js";
import { EventEnvelopeSchema } from "./event.schema.js";

export class EventDeserializer {
  constructor(

    private readonly registry: EventRegistry

  ) { }

  deserialize(message: string): EventEnvelope<unknown> {
    try {

      let parsed: unknown

      try {

        parsed = JSON.parse(message)

      } catch (error) {

        throw new EventDeserializationError("Invalid JSON event message", { cause: error })

      }

      const envelope = EventEnvelopeSchema.parse(parsed)

      const definition = this.registry.get(envelope.eventType, envelope.eventVersion)

      const validatedPayload = definition.payloadSchema.parse(envelope.payload)

      return {
        ...envelope,
        payload: validatedPayload
      }

    } catch (error) {

      if (error instanceof EventDeserializationError || error instanceof EventValidationError) {
        throw error
      }

      if (error instanceof Error && error.name === "ZodError") {
        throw new EventValidationError(`Event validation failed: ${error.message}`, { cause: error })
      }

      throw new EventDeserializationError("Failed to deserialize event", { cause: error })
    }
  }
}
