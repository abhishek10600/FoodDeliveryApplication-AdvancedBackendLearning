export interface RegisterDriverResult {
  driver: {
    id: string,
    email: string,
    roles: string[],
    status: string,
    emailVerified: boolean
  },
  accessToken: string,
  refreshToken: string
}
