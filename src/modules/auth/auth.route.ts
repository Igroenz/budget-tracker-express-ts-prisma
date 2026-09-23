import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authLoginSchema, authRegisterSchema } from "./auth.validator.js";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const authRouter = Router();

authRouter.post("/register", validate(authRegisterSchema, "body"), AuthController.register);
authRouter.post("/login", validate(authLoginSchema, "body"), AuthController.login);
authRouter.delete("/logout", authenticate, AuthController.logout);

export default authRouter;