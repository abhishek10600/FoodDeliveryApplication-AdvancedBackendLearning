import { S3Client } from "@aws-sdk/client-s3"
import { r2Config } from "./r2.config.js"

export const r2Client = new S3Client({
  region: "auto",

  endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,

  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey
  }
})
