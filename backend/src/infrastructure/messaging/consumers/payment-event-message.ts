export interface PaymentEventMessage<TPayload = unknown> {
  id: string
  type: string
  version: number
  payload: TPayload
  key: string
  correlationId?: string
  causationId?: string
  timestamp: string
}
