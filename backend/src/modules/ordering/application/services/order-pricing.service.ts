import { injectable, inject } from "tsyringe"
import { OrderTokens } from "../../infrastructure/persistence/tokens/order.token.js";
import type { IDeliveryFeePolicy } from "../ports/delivery-fee-policy.port.js";
import type { IOrderPricingCatalog } from "../ports/order-pricing-catalog.port.js";
import { IOrderPricingInput, IOrderPricingResult, IPricedOrderItem } from "../dto/order-pricing.dto.js";
import { OrderPricingError } from "../../domain/errors/order-pricing.error.js";

@injectable()
export class OrderPricingService {
  constructor(

    @inject(OrderTokens.DeliveryFeePolicy)
    private readonly deliveryFeePolicy: IDeliveryFeePolicy,

    @inject(OrderTokens.OrderPricingCatalog)
    private readonly pricingCatalog: IOrderPricingCatalog

  ) { }

  public async calculate(
      input: IOrderPricingInput
    ): Promise<IOrderPricingResult> {
      this.validateInput(input)

      const uniqueMenuItemIds = new Set(
        input.items.map((item) => item.menuItemId)
      )

      if (uniqueMenuItemIds.size !== input.items.length) {
        throw new OrderPricingError(
          "Duplicate menu items are not allowed in an order", 400
        )
      }

      const catalogRecords =
        await this.pricingCatalog.findManyByMenuItemIds(
          input.items.map((item) => item.menuItemId)
        )

      const catalogById = new Map(
        catalogRecords.map((record) => [
          record.menuItem.id,
          record
        ])
      )

      const pricedItems: IPricedOrderItem[] = []

      let currency: string | null = null
      let subTotal = 0

      for (let index = 0; index < input.items.length; index++) {
        const requestedItem = input.items[index]
        const record = catalogById.get(requestedItem.menuItemId)

        if (!record) {
          throw new OrderPricingError(
            `Menu item ${requestedItem.menuItemId} was not found`,
            404
          )
        }

        const { menuItem, category, menu, restaurant } = record

        this.validateCatalogRecord(
          menuItem,
          category,
          menu,
          restaurant,
          input.restaurantId
        )

        if (currency === null) {
          currency = menuItem.currency
        } else if (currency !== menuItem.currency) {
          throw new OrderPricingError(
            "All items in an order must use the same currency", 400
          )
        }

        const unitPrice = this.toMinorUnits(menuItem.price)

        const lineTotal = unitPrice * requestedItem.quantity

        if (!Number.isSafeInteger(lineTotal)) {
          throw new OrderPricingError(
            `Invalid line total for menu item ${menuItem.id}`, 400
          )
        }

        subTotal += lineTotal

        if (!Number.isSafeInteger(subTotal)) {
          throw new OrderPricingError(
            "Order subtotal exceeds the supported monetary range", 400
          )
        }

        pricedItems.push({
          menuItemId: menuItem.id,
          itemName: menuItem.name,
          unitPrice,
          quantity: requestedItem.quantity,
          lineTotal
        })
      }

      if (!currency) {
        throw new OrderPricingError("Unable to determine order currency", 400)
      }

      const deliveryFee = await this.deliveryFeePolicy.calculate({
        restaurantId: input.restaurantId,
        currency,
        subTotal,
      })

      this.validateMoney(deliveryFee, "Delivery fee")

      const total = subTotal + deliveryFee

      if (!Number.isSafeInteger(total)) {
        throw new OrderPricingError(
          "Order total exceeds the supported monetary range", 400
        )
      }

      return {
        items: pricedItems,
        currency,
        subTotal,
        deliveryFee,
        total
      }
    }

    private validateInput(input: IOrderPricingInput): void {
      if (!input.restaurantId?.trim()) {
        throw new OrderPricingError("Restaurant ID is required", 400)
      }

      if (!Array.isArray(input.items) || input.items.length === 0) {
        throw new OrderPricingError("An order must contain at least one item", 400)
      }

      for (const item of input.items) {
        if (!item.menuItemId?.trim()) {
          throw new OrderPricingError("Menu item ID is required", 400)
        }

        if (
          !Number.isSafeInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          throw new OrderPricingError(
            "Item quantity must be a positive integer", 400
          )
        }
      }
    }

    private validateCatalogRecord(
      menuItem: {
        id: string
        status: string
        isAvailable: boolean
      },
      category: {
        status: string
      },
      menu: {
        status: string
      },
      restaurant: {
        id: string
        status: string
      },
      requestedRestaurantId: string
    ): void {
      if (restaurant.id !== requestedRestaurantId) {
        throw new OrderPricingError(
          "All menu items must belong to the requested restaurant", 400
        )
      }

      if (restaurant.status !== "ACTIVE") {
        throw new OrderPricingError(
          "Restaurant is not currently accepting orders",
          409
        )
      }

      if (menu.status !== "ACTIVE") {
        throw new OrderPricingError(
          "Restaurant menu is currently unavailable",
          409
        )
      }

      if (category.status !== "ACTIVE") {
        throw new OrderPricingError(
          "Menu category is currently unavailable",
          409
        )
      }

      if (menuItem.status !== "ACTIVE" || !menuItem.isAvailable) {
        throw new OrderPricingError(
          `Menu item ${menuItem.id} is currently unavailable`,
          409
        )
      }
    }

    /**
     * MenuItem.price is stored in whole currency units.
     * For INR: 150 means ₹150.00, which is 15000 paise.
     */
    private toMinorUnits(price: number): number {
      if (!Number.isSafeInteger(price) || price < 0) {
        throw new OrderPricingError("Invalid menu item price", 400)
      }

      const amount = price * 100

      if (!Number.isSafeInteger(amount)) {
        throw new OrderPricingError(
          "Menu item price exceeds the supported monetary range", 400
        )
      }

      return amount
    }

    private validateMoney(amount: number, label: string): void {
      if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new OrderPricingError(`${label} is invalid`, 400)
      }
    }
}
