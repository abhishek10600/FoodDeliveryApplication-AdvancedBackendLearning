import { injectable } from "tsyringe"
import { ITokenHasher } from "../../domain/services/token-hasher.js";
import { createHash } from "crypto";

@injectable()
export class Sha256TokenHasher implements ITokenHasher {
  hash(token: string): string {
    return createHash("sha256").update(token, "utf8").digest("hex")
  }
}
