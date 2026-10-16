import type { Request, Response, NextFunction } from "express";
import { TransactionService } from "./transaction.service.js";
import type { TransactionGetDTO, TransactionRemoveDTO } from "./transaction.validator.js";

const transactionService = new TransactionService();

export const TransactionController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.create(req.user, req.body);
      res.status(201).json({ success: true, message: "Transaction created successfully", data: result });
    } catch (err) {
      next(err);
    }
  },
  
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.get(req.paramsParsed as TransactionGetDTO);
      res.status(200).json({ success: true, message: "Detail transaction retrieved successfully", data: result });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.update(req.user, req.body);
      res.status(200).json({ success: true, message: "Transaction updated successfully", data: result });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.remove(req.paramsParsed as TransactionRemoveDTO);
      res.status(200).json({ success: true, message: "Transaction deleted successfully", data: result });
    } catch (err) {
      next(err);
    }
  },
  
}