export class RestaurantCuisine {

  private readonly id: string
  private readonly restaurantId: string
  private readonly cuisineId: string
  private readonly createdAt: Date
  private updatedAt: Date


  constructor(props: {
    id: string
    restaurantId: string
    cuisineId: string
    createdAt: Date
    updatedAt: Date
  }) {

    this.id = props.id
    this.restaurantId = props.restaurantId
    this.cuisineId = props.cuisineId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt

  }

  public static create(props: {
    restaurantId: string
    cuisineId: string
  }): RestaurantCuisine {
    const now = new Date()

    return new RestaurantCuisine({
      id: crypto.randomUUID(),
      restaurantId: props.restaurantId,
      cuisineId: props.cuisineId,
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(props: {
    id: string
    restaurantId: string
    cuisineId: string
    createdAt: Date
    updatedAt: Date
  }): RestaurantCuisine {
    return new RestaurantCuisine({
      id: props.id,
      restaurantId: props.restaurantId,
      cuisineId: props.cuisineId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })
  }

  public getId(): string {
    return this.id
  }

  public getRestaurantId(): string {
    return this.restaurantId
  }

  public getCuisineId(): string {
    return this.cuisineId
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

}
