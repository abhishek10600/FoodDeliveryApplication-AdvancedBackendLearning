import { randomUUID } from "node:crypto";
import { EventContext } from "../context/event-context.js";
import { EventEnvelope } from "../contracts/event-envelope.js";
import { EventDefinition } from "../events/event-definition.js";
import { EventSerializationError, EventValidationError } from "./event.errors.js";

export class EventSerializer {

  serialize<TPayload>(
    definition: EventDefinition<TPayload>,
    payload: TPayload,
    context: EventContext,
    producer: string
  ): string {
    try {

      const validatedPayload = definition.payloadSchema.parse(payload)

      const envelope: EventEnvelope<TPayload> = {
        id: randomUUID(),
        eventType: definition.eventType,
        eventVersion: definition.eventVersion,
        occurredAt: new Date().toISOString(),
        producer,
        correlationId: context.correlationId,
        causationId: context.causationId,
        payload: validatedPayload
      }

      return JSON.stringify(envelope)

    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        throw new EventValidationError(`Invalid payload for ${definition.eventType}: ${error.message}`, { cause: error }
        )
      }

      throw new EventSerializationError(`Failed to serialize ${definition.eventType}`, {cause: error})
    }
  }
}
