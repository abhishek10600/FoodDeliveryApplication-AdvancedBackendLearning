
import type { OrderStatus } from "../../domain/enums/order-status.enum.js";

export interface OrderCreationInput {
  restaurantId: string;
  addressId: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
}

export interface OrderCreationMetadata {
  idempotencyKey: string;
  correlationId: string;
}

export interface OrderCreationResult {
  orderId: string;
  status: OrderStatus;
  subTotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
}

export interface OrderCreationUseCase {
  execute(
    customerId: string,
    input: OrderCreationInput,
    metadata: OrderCreationMetadata
  ): Promise<OrderCreationResult>;
}
