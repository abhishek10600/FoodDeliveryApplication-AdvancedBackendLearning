export interface ValidationError {
  path: string;
  message: string
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: ValidationError[]
}


export interface ErrorResponse {
  success: false;
  error: ErrorDetails;
  requestId?: string;
  correlationId?: string;
  timestamp?: string
}
