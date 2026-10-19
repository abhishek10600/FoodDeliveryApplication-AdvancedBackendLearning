export interface MenuItemImageUpdateInput {
  id: string
  restaurantId: string
  ownerId: string
  menuCategoryId: string
  file: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
  }
}
