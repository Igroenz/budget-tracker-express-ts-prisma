import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { categoryIdParams, categoryQuerySchema, createSchema, updateSchema } from "./category.validator.js";
import { CategoryController } from "./category.controller.js";


const categoryRouter = Router();

categoryRouter.post("/", authenticate, validate(createSchema, "body"), CategoryController.create);
categoryRouter.get("/", authenticate, validate(categoryQuerySchema, "query"), CategoryController.getAll);
categoryRouter.get("/:id", authenticate, validate(categoryIdParams, "params"), CategoryController.get);
categoryRouter.put("/:id", authenticate, validate(updateSchema, "body"), CategoryController.update);
categoryRouter.delete("/:id", authenticate, validate(categoryIdParams, "params"), CategoryController.remove);


export default categoryRouter;