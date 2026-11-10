import { EventDefinition } from "./event-definition.js";

export class EventRegistry {
  private readonly definitions = new Map<string, EventDefinition<unknown>>()

  private getKey(eventType: string, eventVersion: number): string {
    return `${eventType}:v${eventVersion}`
  }

  register<TPayload>(definition: EventDefinition<TPayload>): void {

    const key = this.getKey(definition.eventType, definition.eventVersion)

    if (this.definitions.has(key)) {
      throw new Error(`Event definition already registered: ${key}`)
    }

    this.definitions.set(key, definition as EventDefinition<unknown>)
  }

  get(eventType: string, eventVersion: number): EventDefinition<unknown> {

    const key = this.getKey(eventType, eventVersion)

    const definition = this.definitions.get(key)

    if (!definition) {
      throw new Error(`Unsupported event version: ${key}`)
    }

    return definition
  }

  has(eventType: string, eventVersion: number): boolean {
    return this.definitions.has(this.getKey(eventType, eventVersion))
  }
}
