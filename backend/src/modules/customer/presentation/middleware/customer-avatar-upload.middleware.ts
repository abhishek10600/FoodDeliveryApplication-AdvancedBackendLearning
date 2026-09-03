import multer from "multer";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

// const ALLOWED_MIME_TYPES = new Set([
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp"
// ])

export const customerAvatarUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_AVATAR_SIZE,
    files: 1,
  },

  // fileFilter: (_req, file, callback) => {

  //   console.log("Uploaded file:");
  //   console.log("originalname:", file.originalname);
  //   console.log("mimetype:", file.mimetype);

  //   if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
  //     callback(new Error("Only JPEG, PNG and WEBP images are allowed"))

  //     return;
  //   }

  //   callback(null, true)
  // }
})
