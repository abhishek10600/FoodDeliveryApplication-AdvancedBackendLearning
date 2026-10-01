import { AppError } from "../../../../shared/errors/AppError.js";

export class MenuDomainError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "MENU_DOMAIN_ERROR", true)
  }
}
