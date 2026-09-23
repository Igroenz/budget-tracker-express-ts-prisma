import express from "express";
import { requestLogger } from "../middleware/request-logger.js";
import router from "../routes/index.js";
import { notFound } from "../middleware/not-found.js";
import { errorHandler } from "../middleware/error-handler.js";
import { prisma } from "../config/db.js";
import { logger } from "../config/logging.js";

const app = express();
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
    res.json({ success: true, message: "Server is healthy" });
})

app.get("/health/db", async (_req, res, next) => {
  try {
    const result = await prisma.user.findMany({take: 1});
    res.json({ success: true, message: "Database connected", sample: result });
  } catch (err) {
    logger.error("DB connection failed", err);
    next(err);
  }
});

app.use("/api/v1", router);
app.use(notFound);
app.use(errorHandler)

export default app;