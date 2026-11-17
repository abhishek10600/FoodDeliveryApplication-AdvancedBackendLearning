import { PaymentProvider } from "../enums/payment-provider.enum.js"
import { PaymentStatus } from "../enums/payment-status.enum.js"
import { PaymentDomainError } from "../errors/payment-domain.error.js"

export interface IPaymentProps {

  id: string
  orderId: string
  provider: PaymentProvider
  status: PaymentStatus
  amount: number
  currency: string
  idempotencyKey: string
  providerRef?: string | null
  failureCode?: number | null
  failureMessage?: string | null
  processedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ICreatePaymentProps {
  orderId: string
  provider: PaymentProvider
  status: PaymentStatus
  amount: number
  currency: string
  idempotencyKey: string
  createdAt: Date
}


export class Payment {

  private readonly id: string
  private readonly orderId: string
  private provider: PaymentProvider
  private status: PaymentStatus
  private amount: number
  private currency: string
  private idempotencyKey: string
  private _providerRef: string | null
  private _failureCode: number | null
  private _failureMessage: string | null
  private _processedAt: Date | null
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IPaymentProps) {

    this.id = props.id
    this.orderId = props.orderId
    this.provider = props.provider
    this.amount = props.amount
    this.status = props.status
    this.currency = props.currency
    this.idempotencyKey = props.idempotencyKey
    this._providerRef = props.providerRef ? props.providerRef : null
    this._failureCode = props.failureCode ? props.failureCode : null
    this._failureMessage = props.failureMessage ? props.failureMessage : null
    this._processedAt = props.processedAt ? props.processedAt : null
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: ICreatePaymentProps): Payment {
    const now = new Date()

    return new Payment({

      id: crypto.randomUUID(),
      orderId: props.orderId,
      provider: props.provider,
      status: props.status,
      amount: props.amount,
      currency: props.currency,
      idempotencyKey: props.idempotencyKey,
      providerRef: null,
      failureCode: null,
      failureMessage: null,
      processedAt: null,
      createdAt: now,
      updatedAt: now
    })

  }

  public static rehydrate(props: IPaymentProps): Payment {
    return new Payment(props)
  }

  public markProcessing(): void {

    this.ensureTransition(PaymentStatus.PROCESSING)

    this.status = PaymentStatus.PROCESSING

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getOrderId(): string {
    return this.orderId
  }

  public getProvider(): PaymentProvider {
    return this.provider
  }

  public getStatus(): PaymentStatus {
    return this.status
  }

  public getAmount(): number {
    return this.amount
  }

  public getCurrency(): string {
    return this.currency
  }

  public getIdempotencyKey(): string {
    return this.idempotencyKey
  }

  public getProviderRef(): string | null {
    return this._providerRef
  }

  public getFailureCode(): number | null {
    return this._failureCode
  }

  public getFailureMessage(): string | null {
    return this._failureMessage
  }

  public getProcessedAt(): Date | null {
    return this._processedAt
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public markSucceeded(providerRef: string): void {

    if (!providerRef.trim()) {
      throw new PaymentDomainError("Provided reference is required to mark the payment status as SUCCEEDED.", 400)
    }

    this.ensureTransition(PaymentStatus.SUCCEEDED)

    this.status = PaymentStatus.SUCCEEDED

    this._providerRef = providerRef
    this._failureCode = null
    this._failureMessage = null
    this._processedAt = new Date()

    this.touch()
  }

  public markFailed(failureCode: string, failureMessage: string): void {

    if (!failureMessage.trim()) {
      throw new PaymentDomainError("Failure message is required to mark a payment as FAILED", 400)
    }

    this.ensureTransition(PaymentStatus.FAILED)

    this.status = PaymentStatus.FAILED
    this._failureCode = failureCode
    this._failureMessage = failureMessage
    this._processedAt = new Date()

    this.touch()
  }

  public cancel(): void {

    this.ensureTransition(PaymentStatus.CANCELLED)

    this.status = PaymentStatus.CANCELLED
    this._processedAt = new Date()

    this.touch()
  }

  private ensureTransition(nextStatus: PaymentStatus): void {

    const allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      [PaymentStatus.PENDING]: [
        PaymentStatus.PROCESSING,
        PaymentStatus.CANCELLED
      ],

      [PaymentStatus.PROCESSING]: [
        PaymentStatus.SUCCEEDED,
        PaymentStatus.FAILED
      ],

      [PaymentStatus.SUCCEEDED]: [],

      [PaymentStatus.FAILED]: [],

      [PaymentStatus.CANCELLED]: []
    }

    const allowed = allowedTransitions[this.status].includes(nextStatus)

    if (!allowed) {
      throw new PaymentDomainError("Invalid Payment status transactionn", 400)
    }

  }

  private touch(): void {

    this.updatedAt = new Date()
  }

}
