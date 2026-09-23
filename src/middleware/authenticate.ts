import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../helpers/app-error.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";

declare global {
  namespace Express {
    interface Request {
      user?: unknown;
    }
  }
}

const authRepository = new AuthRepository();

export const authenticate = async(req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return next(new UnauthorizedError("Token tidak ditemukan"));

    const token = header.split(" ")[1];
    const payload = await authRepository.findByToken(token as string);

    if (!payload) return next(new UnauthorizedError("Token tidak valid atau kedaluwarsa"));

    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Token tidak valid atau kedaluwarsa"));
  }
};