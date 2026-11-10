import type { EventEnvelope } from "./event-envelope.js";

export type IntegrationEvent<TPayload> = EventEnvelope<TPayload>
