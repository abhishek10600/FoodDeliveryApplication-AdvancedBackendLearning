export class EventSerializationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)

    this.name = "EventSerializationError"
  }
}


export class EventDeserializationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)

    this.name = "EventDeserializationError"
  }
}

export class EventValidationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)

    this.name = "EventValidationError"
  }
}
