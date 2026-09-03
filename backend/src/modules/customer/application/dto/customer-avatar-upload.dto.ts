export interface CustomerAvatarUploadInput {
  userId: string;

  file: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
  }
}
