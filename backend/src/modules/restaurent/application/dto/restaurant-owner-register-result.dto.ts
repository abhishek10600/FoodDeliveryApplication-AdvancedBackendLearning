export interface RegisterRestaurantOwnerResult {
  restaurant_owner: {
    id: string;
    email: string;
    roles: string[];
    status: string;
    emailVerified: boolean;
  },
  accessToken: string;
  refreshToken: string
}
