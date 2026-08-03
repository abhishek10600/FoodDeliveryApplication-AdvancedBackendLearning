export interface LogContext {
  serviceId?: string;
  component?: string;
  module?: string;
  operation?: string;
  requestId?: string;
  correlationId?: string;
  userId?: string;
  traceId?: string;
  spanId?: string;
  event?: string;
  [key: string]: unknown
}
