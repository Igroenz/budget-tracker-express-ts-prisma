import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, message: "User registered successfully", data: result });
    } catch (err) {
      next(err); // dilempar ke error handler middleware, JANGAN handle try-catch manual di sini
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({ success: true, message: "Login successful", data: result });
    } catch (err) {
      next(err);
    }
  },
  
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user);
      res.status(200).json({ success: true, message: "Logout successful", data: null });
    } catch (err) {
      next(err);
    }
  },


}