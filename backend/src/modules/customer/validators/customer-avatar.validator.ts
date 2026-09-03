const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

// const ALLOWED_MIME_TYPES = new Set([
//   "image/jpeg",
//   "image/png",
//   "image/webp"
// ])

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp"
])

export interface CustomerAvatarFile {
  buffer: Buffer,
  mimetype: string;
  originalname: string;
  size: number;
}

export function validateCustomerAvatar(file: CustomerAvatarFile): void {
  if (!file) {
    throw new Error("Avatar file cannot be empty");
  }

  if (file.size <= 0) {
    throw new Error("Avatar file cannot be empty")
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error("Avatar file cannot exceed 5 MB")
  }

  // if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
  //   throw new Error("Only JPEG, PNG and WEBP images are allowed")
  // }

  const extension = getFileExtension(file.originalname)

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("Only JPG, JPEG, PNG and WEBP files are allowed")
  }
}

function getFileExtension(filename: string): string {
  const index = filename.lastIndexOf(".");

  if (index === -1) {
    return "";
  }

  return filename.slice(index).toLowerCase()
}
