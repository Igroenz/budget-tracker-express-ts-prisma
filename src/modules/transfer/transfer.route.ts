import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createSchema, paramsSchema } from "./transfer.validator.js";
import { TransferController } from "./transfer.controller.js";

const transferRouter = Router();

transferRouter.post("/", authenticate, validate(createSchema, "body"), TransferController.create);
transferRouter.get("/:id", authenticate, validate(paramsSchema, "params"), TransferController.get);
transferRouter.delete("/:id", authenticate, validate(paramsSchema, "params"), TransferController.remove);

export default transferRouter;
