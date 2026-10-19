import multer from "multer"
import mime from "mime-types"

const MAX_MENU_ITEM_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
])

export const menuItemImageUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_MENU_ITEM_FILE_SIZE,
    files: 1
  },

  fileFilter: (_req, file, callback) => {
    console.log("Uploaded file:");
    console.log("originalname:", file.originalname);
    console.log("mimetype:", file.mimetype);

    let currentMimeType = file.mimetype

    if (currentMimeType === "application/octet-stream" || !currentMimeType) {
      currentMimeType = mime.lookup(file.originalname) || "application/octet-stream"
    }

    if (!ALLOWED_MIME_TYPES.has(currentMimeType)) {
      callback(new Error("Only JPEG, PNG and WEBP images are allowed"))
      return;
    }

    file.mimetype = currentMimeType;

    callback(null, true)
  }
})
