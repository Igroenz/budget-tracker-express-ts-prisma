import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../helpers/app-error.js";
import type { ZodType } from "zod";

type Source = "body" | "params" | "query";

export const validate = (schema: ZodType, source: Source = "body") => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // if (!req[source]) return next();

    const validation = schema.safeParse(req[source]);
    
    if (!validation.success) {
      const errors = validation.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(new ValidationError("Validasi gagal", errors));
    };

    if (source === "body") req[source] = validation.data;
    if (source === "query") req.queryParsed = validation.data; 
    if (source === "params") req.paramsParsed = validation.data; 
    
    next();
  }
}