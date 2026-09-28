import type { Request, Response, NextFunction } from "express";
import { AccountService } from "./account.service.js";
import type { AccountParamsDTO, AccountQueryDTO } from "./account.validator.js";

const accountService = new AccountService();

export const AccountController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await accountService.create(req.user, req.body);
      res.status(201).json({ success: true, message: "Account created successfully", data: result });
    } catch (err) {
      next(err)
    }
  },

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.queryParsed as AccountQueryDTO;
      const result = await accountService.search(req.user, query);
      res.status(200).json({ success: true, message: "Account retrieved successfully", data: result.data, meta: result.meta });
    } catch (err) {
      next(err)
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.paramsParsed as AccountParamsDTO;
      const result = await accountService.get(params);
      res.status(200).json({success: true, message: "Detail account retrieved successfully", data: result})
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await accountService.get(req.body);
      res.status(200).json({success: true, message: "Account updated successfully", data: result})
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.paramsParsed as AccountParamsDTO;
      await accountService.get(params);
      res.status(200).json({success: true, message: "Account deleted successfully"})
    } catch (err) {
      next(err)
    }
  }
}