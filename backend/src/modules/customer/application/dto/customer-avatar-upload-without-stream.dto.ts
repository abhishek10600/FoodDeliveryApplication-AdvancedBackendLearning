export interface CustomerAvatarUploadWithoutStreamInput {
  userId: string;

  file: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
  }
}
