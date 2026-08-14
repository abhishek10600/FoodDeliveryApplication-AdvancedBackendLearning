export interface ITokenHasher {
  hash(token: string): string;
}
