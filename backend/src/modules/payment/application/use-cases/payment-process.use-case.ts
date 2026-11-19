import { ProcessPaymentInput, ProcessPaymentResult } from "../dto/process-payment.dto.js";

export interface PaymentProcessUseCase {

  execute(input: ProcessPaymentInput): Promise<ProcessPaymentResult>

}
