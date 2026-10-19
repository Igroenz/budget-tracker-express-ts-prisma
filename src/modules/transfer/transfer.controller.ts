import type { Request, Response, NextFunction } from "express";
import { TransferService } from "./transfer.service.js";
import type { TransferIdDTO } from "./transfer.validator.js";

const transferService = new TransferService();

export const TransferController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transferService.create(req.user, req.body);
      res.status(201).json({ success: true, message: "Transfer created successfully", data: result });
    } catch (err) {
      next(err);
    }
  },
  
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transferService.get(req.paramsParsed as TransferIdDTO);
      res.status(200).json({ success: true, message: "Detail transfer retrieved successfully", data: result });
    } catch (err) {
      next(err);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transferService.remove(req.paramsParsed as TransferIdDTO);
      res.status(200).json({ success: true, message: "Transfer deleted successfully", data: result });
    } catch (err) {
      next(err);
    }
  },
  
}