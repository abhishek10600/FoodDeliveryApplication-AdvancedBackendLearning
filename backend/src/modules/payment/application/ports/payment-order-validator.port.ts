export interface OrderDetails {

  orderId: string
  amount: number
  currency: string
}

export interface PaymentOrderValidator {
  getPayableOrder(orderId: string): Promise<OrderDetails>
}
