export interface AddressResult {
  id: string
  customerId: string
  houseName: string
  streetName: string
  landmark?: string
  city: string
  state: string
  country: string
  pin: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}
