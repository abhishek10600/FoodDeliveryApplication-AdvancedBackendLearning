export interface MenuAddOnGroupUpdateInput {
  id: string
  menuItemId: string
  ownerId: string
  name?: string
  minSelections?: number
  maxSelections?: number
  displayOrder?: number
}
