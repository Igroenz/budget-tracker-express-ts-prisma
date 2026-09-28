import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { accountCreateSchema, accountParamSchema, accountQuerySchema, accountUpdateSchema } from "./account.validator.js";
import { AccountController } from "./account.controller.js";

const accountRouter = Router();

accountRouter.post("/", authenticate, validate(accountCreateSchema, "body"), AccountController.create);
accountRouter.get("/", authenticate, validate(accountQuerySchema, "query"), AccountController.search);
accountRouter.get("/:id", authenticate, validate(accountParamSchema, "params"), AccountController.get);
accountRouter.put("/:id", authenticate, validate(accountUpdateSchema, "body"), AccountController.update);
accountRouter.delete("/:id", authenticate, validate(accountParamSchema, "params"), AccountController.remove);

export default accountRouter;