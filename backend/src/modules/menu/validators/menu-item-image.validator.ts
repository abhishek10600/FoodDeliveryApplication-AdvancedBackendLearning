import { MenuDomainError } from "../domain/errors/menu-domain.error.js";

const MAX_MENU_ITEM_IMAGE_SIZE = 5 * 1024 * 1024

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp"
])

export interface MenuItemImageFile {
  buffer: Buffer,
  mimetype: string,
  originalname: string;
  size: number
}

export function validateMenuItemImage(file: MenuItemImageFile): void {
  if (!file) {
    throw new MenuDomainError("Menu item file cannot be empty", 400)
  }

  if (file.size <= 0) {
    throw new MenuDomainError("Menu item file cannot be emppty", 400)
  }

  if (file.size > MAX_MENU_ITEM_IMAGE_SIZE) {
    throw new MenuDomainError("Menu item file cannot exceed 5 MB", 400)
  }

  const extension = getFileExtenstion(file.originalname)

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new MenuDomainError("Only JPG, JPEG, PNG and WEBP files are allowed", 400)
  }
}

function getFileExtenstion(filename: string): string {
  const index = filename.lastIndexOf(".")

  if (index === -1) {
    return ""
  }

  return filename.slice(index).toLowerCase()
}
