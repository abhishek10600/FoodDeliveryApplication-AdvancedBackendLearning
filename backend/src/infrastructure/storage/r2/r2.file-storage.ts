import { injectable } from "tsyringe";
import { CompleteMultipartUploadInput, CreateMultipartUploadInput, CreateMultipartUploadResult, FileStorage, PresignedUploadPartInput, PresignedUploadPartResult, StoredFile, UploadFileInput } from "../../../shared/contracts/storage/file-storage.js";
import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand, DeleteObjectCommand, PutObjectCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { r2Config } from "./r2.config.js";
import { r2Client } from "./rc.client.js";

@injectable()
export class R2FileStorage implements FileStorage {

  // use this for simple upload
  async upload(input: UploadFileInput): Promise<StoredFile> {

    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      ContentLength: input.contentLength
    })

    await r2Client.send(command)

    return {
      key: input.key,
      url: this.getUrl(input.key)
    }

  }


  async createMultipartUpload(input: CreateMultipartUploadInput): Promise<CreateMultipartUploadResult> {

    const command = new CreateMultipartUploadCommand({
      Bucket: r2Config.bucketName,
      Key: input.key,
      ContentType: input.contentType
    })

    const response = await r2Client.send(command)

    if (!response.UploadId) {
      throw new Error("Failed to create multipart upload")
    }

    return {
      uploadId: response.UploadId,
      key: input.key
    }

  }

  async createPresignedUploadPartUrl(input: PresignedUploadPartInput): Promise<PresignedUploadPartResult> {

    const command = new UploadPartCommand({
      Bucket: r2Config.bucketName,
      Key: input.key,
      UploadId: input.uploadId,
      PartNumber: input.partNumber
    })

    const url = await getSignedUrl(
      r2Client,
      command,
      {
        expiresIn: 900
      }
    )

    return {
      partNumber: input.partNumber,
      url
    }

  }

  async completeMultipartUpload(input: CompleteMultipartUploadInput): Promise<StoredFile> {

    const command = new CompleteMultipartUploadCommand({
      Bucket: r2Config.bucketName,
      Key: input.key,
      UploadId: input.uploadId,

      MultipartUpload: {
        Parts: input.parts.map((part) => ({
          PartNumber: part.partNumber,
          ETag: part.etag
        }))
      }

    })

    await r2Client.send(command)

    return {
      key: input.key,
      url: this.getUrl(input.key)
    }

  }

  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {

    const command = new AbortMultipartUploadCommand({
      Bucket: r2Config.bucketName,
      Key: key,
      UploadId: uploadId
    })

    await r2Client.send(command)

  }

  async delete(key: string): Promise<void> {

    const command = new DeleteObjectCommand({
      Bucket: r2Config.bucketName,
      Key: key
    })

    await r2Client.send(command)

  }

  getUrl(key: string): string {
    return `${r2Config.publicUrl}/${key}`
  }

}
