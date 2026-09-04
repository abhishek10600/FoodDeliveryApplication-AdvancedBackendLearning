import { injectable, inject} from "tsyringe";
import { CustomerAvatarUploadUseCase } from "./customer-avatar-upload.use-case.js";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../domain/repositories/customer.repository.js";
import { IdentityTokens } from "../../../identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../../identity/domain/repositories/user.repository.js";
import { InfrastructureTokens } from "../../../../infrastructure/container/index.js";
import type { FileStorage, CompletedPart } from "../../../../shared/contracts/storage/file-storage.js";
import { CustomerAvatarUploadInput } from "../dto/customer-avatar-upload.dto.js";
import { validateCustomerAvatar } from "../../validators/customer-avatar.validator.js";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";
import { CustomerNotFoundError } from "../../domain/errors/customer-not-found.error.js";
import { CustomerAvatarUrl } from "../../domain/value-objects/customer-avatar.vo.js";

const PART_SIZE = 2 * 1024 * 1024

@injectable()
export class CustomerAvatarUploadUseCaseImpl implements CustomerAvatarUploadUseCase {

  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    @inject(InfrastructureTokens.FileStorage)
    private readonly fileStorage: FileStorage

  ) { }

  async execute(input: CustomerAvatarUploadInput): Promise<void> {

    const userId = input.userId

    validateCustomerAvatar(input.file);

    const user = await this.userRepo.findById(userId)

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    const customer = await this.customerRepo.findByUserId(userId)

    if (!customer) {
      throw new CustomerNotFoundError()
    }

    const oldAvatarUrl = customer.getAvatarUrl()

    const extension = this.getExtension(input.file.originalname)

    const key = `customers/${input.userId}/avatar/${crypto.randomUUID()}${extension}`

    let uploadId: string | null = null;

    try {

      // create the multipart upload and get the uploadId
      const multipartUpload = await this.fileStorage.createMultipartUpload({
        key,
        contentType: input.file.mimetype
      })

      uploadId = multipartUpload.uploadId

      // split avatar into parts
      const parts = this.splitIntoParts(input.file.buffer)

      const completedParts: CompletedPart[] = [];

      // upload each part
      for (let index = 0; index < parts.length; index++) {
        const partNumber = index + 1;

        const part = parts[index];

        // generate the presigned url
        const presigned = await this.fileStorage.createPresignedUploadPartUrl({
          key,
          uploadId,
          partNumber
        })

        // upload the part to R2
        const response = await fetch(
          presigned.url,
          {
            method: "PUT",
            headers: {
              "Content-Type": input.file.mimetype
            },
            body: new Uint8Array(part) // fetch does not support buffer in body
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to upload avatar part: ${response.status}`)
        }

        // R2 returns flag
        const etag = response.headers.get("etag")

        if (!etag) {
          throw new Error(`Missing Etag for avatar part ${partNumber}`)
        }

        completedParts.push({
          partNumber,
          etag
        })
      }

      // Complete multipart upload
      const storedFile = await this.fileStorage.completeMultipartUpload({
        key,
        uploadId,
        parts: completedParts
      })

      customer.removeAvatarUrl()

      customer.changeAvatarUrl(
        CustomerAvatarUrl.create(storedFile.url)
      )

      // Persist customer
      await this.customerRepo.update(customer)

      // delete the old avatar
      if (!oldAvatarUrl) {
        return;
      }

      const oldAvatarUrlValue = oldAvatarUrl.getValue()

      if (!oldAvatarUrlValue) {
        return;
      }

      const oldAvatarKey = this.extractStorageKey(oldAvatarUrlValue)

      if (oldAvatarKey) {
        try {
          await this.fileStorage.delete(oldAvatarKey)
        } catch {

        }
      }

    } catch (error) {
      if (uploadId) {
        await this.safeAbort(key, uploadId)
      }

      console.error(error)

      throw error;
    }
  }

  private splitIntoParts(buffer: Buffer): Buffer[] {
    const parts: Buffer[] = []

    for (let offset = 0; offset < buffer.length; offset += PART_SIZE) {
      parts.push(
        buffer.subarray(
          offset,
          Math.min(offset + PART_SIZE, buffer.length)
        )
      )

    }

    return parts
  }

  private getExtension(filename: string): string {
    const index = filename.lastIndexOf(".");

    if (index === -1) {
      return "";
    }

    return filename.slice(index).toLowerCase()
  }

  private extractStorageKey(avatarUrl: string): string | null {
    try {
      const url = new URL(avatarUrl);

      const key = url.pathname.replace(/^\/+/, "")

      return key ? decodeURIComponent(key) : null
    }
    catch {
      return null
    }
  }

  private async safeAbort(key: string, uploadId: string): Promise<void> {
    try {
      await this.fileStorage.abortMultipartUpload(key, uploadId)
    } catch{ }
  }

}
