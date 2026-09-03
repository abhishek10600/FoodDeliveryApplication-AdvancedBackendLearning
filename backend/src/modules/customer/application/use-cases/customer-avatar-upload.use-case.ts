import { CustomerAvatarUploadInput } from "../dto/customer-avatar-upload.dto.js";

export interface CustomerAvatarUploadUseCase {

  execute(input: CustomerAvatarUploadInput): Promise<void>

}
