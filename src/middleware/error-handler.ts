import type { ErrorRequestHandler } from "express";
import { AppError } from "../helpers/app-error.js";
import { logger } from "../config/logging.js";


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    logger.warn(`${err.name}: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details ?? undefined,
    });
  };

  logger.error(err.stack ?? err.message);
  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server",
  });
};