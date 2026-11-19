import { injectable } from "tsyringe"
import { randomUUID } from "node:crypto";
import { EventContext } from "../context/event-context.js";
import { EventEnvelope } from "../contracts/event-envelope.js";
import { EventDefinition } from "./event-definition.js";

@injectable()
export class EventFactory {
  create<TPayload>(definition: EventDefinition<TPayload>, payload: TPayload, context: EventContext, producer: string): EventEnvelope<TPayload> {

    const validatedPayload = definition.payloadSchema.parse(payload)

    return {
      id: randomUUID(),
      eventType: definition.eventType,
      eventVersion: definition.eventVersion,
      occurredAt: new Date().toISOString(),
      producer,
      correlationId: context.correlationId,
      causationId: context.causationId,
      payload: validatedPayload
    }
  }
}
