import { PaymentProvider } from "../../domain/enums/payment-provider.enum.js"

export interface ProcessPaymentInput {
  orderId: string
  customerId: string
  provider: PaymentProvider
  idempotencyKey: string
  correlationId: string
}

export interface ProcessPaymentResult {
  
  paymentId: string
  orderId: string
  status: string
  amount: number
  currency: string
  provider: PaymentProvider
  providerRef: string | null
  failureCode: string | null
  failureMessage: string | null
}
