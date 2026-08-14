import { Response } from "express";
import { ApiResponse } from "../types/ApiResponse.types.js";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload?: ApiResponse<T>,
) => {
  return res.status(statusCode).json(payload);
};
