export interface UploadFileInput {
  key: string;
  body: Buffer;
  contentType: string;
  contentLength: number;
}

export interface CreateMultipartUploadInput {
  key: string;
  contentType: string;
}

export interface CreateMultipartUploadResult {
  uploadId: string;
  key: string;
}

export interface PresignedUploadPartInput {
  key: string;
  uploadId: string;
  partNumber: number;
}

export interface PresignedUploadPartResult {
  partNumber: number;
  url: string;
}

export interface CompletedPart {
  partNumber: number;
  etag: string;
}

export interface CompleteMultipartUploadInput {
  key: string;
  uploadId: string;
  parts: CompletedPart[];
}

export interface StoredFile {
  key: string;
  url: string;
}

export interface FileStorage {

  upload(input: UploadFileInput): Promise<StoredFile>

  createMultipartUpload(input: CreateMultipartUploadInput): Promise<CreateMultipartUploadResult>;

  createPresignedUploadPartUrl(input: PresignedUploadPartInput): Promise<PresignedUploadPartResult>

  completeMultipartUpload(input: CompleteMultipartUploadInput): Promise<StoredFile>

  abortMultipartUpload(key: string, uploadId: string): Promise<void>

  delete(key: string): Promise<void>

  getUrl(key: string): string
}
