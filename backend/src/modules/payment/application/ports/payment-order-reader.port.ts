export interface PaymentOrderSnapshot {
  orderId: string
  customerId: string
  status: string
  amount: number
  currency: string
}

export interface IPaymentOrderReader {
  findPayableOrder(orderId: string, customerId: string): Promise<PaymentOrderSnapshot | null>
}
