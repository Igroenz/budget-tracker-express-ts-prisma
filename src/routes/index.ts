import { Router } from "express";
import authRouter from "../modules/auth/auth.route.js";
import accountRouter from "../modules/account/account.route.js";
import categoryRouter from "../modules/category/category.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/accounts", accountRouter);
router.use("/category", categoryRouter);

export default router;