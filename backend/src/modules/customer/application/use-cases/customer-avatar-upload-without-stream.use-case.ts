import { CustomerAvatarUploadWithoutStreamInput } from "../dto/customer-avatar-upload-without-stream.dto.js";

export interface CustomerAvatarUploadWithoutStreamUseCase {

  execute(input: CustomerAvatarUploadWithoutStreamInput): Promise<void>

}
