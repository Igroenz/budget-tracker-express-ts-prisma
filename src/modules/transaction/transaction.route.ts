import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createSchema, getByIdSchema, updateSchema } from "./transaction.validator.js";
import { TransactionController } from "./transaction.controller.js";

const transactionRouter = Router();

transactionRouter.post("/", authenticate, validate(createSchema, "body"), TransactionController.create);
transactionRouter.get("/:id", authenticate, validate(getByIdSchema, "params"), TransactionController.get);
transactionRouter.put("/:id", authenticate, validate(updateSchema, "body"), TransactionController.update);
transactionRouter.delete("/:id", authenticate, validate(getByIdSchema, "params"), TransactionController.remove);

export default transactionRouter;
