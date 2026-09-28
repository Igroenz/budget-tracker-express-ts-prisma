import { Router } from "express";
import authRouter from "../modules/auth/auth.route.js";
import accountRouter from "../modules/account/account.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/accounts", accountRouter);

export default router;