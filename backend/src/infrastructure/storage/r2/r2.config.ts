import { env } from "../../../config/env.config.js";

export const r2Config = {
  accountId: env.R2_ACCOUNT_ID,
  accessKeyId: env.R2_ACCESS_KEY_ID,
  secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  bucketName: env.R2_BUCKET_NAME,
  publicUrl: env.R2_PUBLIC_URL
}
