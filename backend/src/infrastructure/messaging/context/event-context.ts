import { randomUUID } from "node:crypto"
import { EventEnvelope } from "../contracts/event-envelope.js"

export interface EventContext {
  correlationId: string
  causationId: string | null
}

export function createRootEventContext(): EventContext {
  return {
    correlationId: randomUUID(),
    causationId: null
  }
}


export function createChildEventContext(parentEvent: EventEnvelope<unknown>): EventContext {
  return {
    correlationId: parentEvent.correlationId,
    causationId: parentEvent.id
  }
}
