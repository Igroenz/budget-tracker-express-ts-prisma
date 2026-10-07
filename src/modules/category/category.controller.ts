import type { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service.js";
import type { CategoryParamsId, CategoryQueryDTO } from "./category.validator.js";

const categoryService = new CategoryService();

export const CategoryController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.create(req.user, req.body);
      res.status(201).json({ success: true, message: "Category created successfully", data: result });
    } catch (err) {
      next(err);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.get(req.paramsParsed as CategoryParamsId);
      res.status(200).json({ success: true, message: "Detail category retrieved successfully", data: result });
    } catch (err) {
      next(err)
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.getAll(req.user, req.queryParsed as CategoryQueryDTO);
      res.status(200).json({ success: true, message: "Categories retrieved successfully", data: result });
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.update(req.user, req.body);
      res.status(200).json({ success: true, message: "Category updated successfully", data: result });
    } catch (err) {
      next(err)
    }
  },
  
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.remove(req.user, req.paramsParsed as CategoryParamsId);
      res.status(200).json({ success: true, message: "Category deleted successfully"});
    } catch (err) {
      next(err)
    }
  },
}