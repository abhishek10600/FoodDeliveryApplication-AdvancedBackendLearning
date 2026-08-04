export interface ErrorResponse {
  success: false,
  error: {
    code: string;
    message: string;
  },
  requestId?: string;
  correlationId?: string;
  timestamp?: string
}
