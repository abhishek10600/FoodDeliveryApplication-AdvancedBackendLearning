export interface PaymentProcessorInput {
  paymentId: string
  orderId: string
  amountMinor: number
  currency: string
  idempotencyKey: string
}


export interface PaymentProcessorSuccess {
  success: true
  providerRef: string
}

export interface PaymentProcessorFailure {
  success: false,
  failureCode: string,
  failureMessage: string
}

export type PaymentProcessorResult = PaymentProcessorSuccess | PaymentProcessorFailure

export type DummyPaymentFailurePolicy = (input: PaymentProcessorInput) => boolean

export interface PaymentProcessor {

  process(input: PaymentProcessorInput): Promise<PaymentProcessorResult>
}
