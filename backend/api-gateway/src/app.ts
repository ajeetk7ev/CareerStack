import cors from "cors";
import express from "express";
import helmet from "helmet";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { rateLimiterMiddleware } from "./middlewares/rateLimiter.middleware.js";
import { requestIdMiddleware } from "./middlewares/requestId.middleware.js";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware.js";
import gatewayRoutes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(rateLimiterMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway is running",
  });
});

app.use("/api/v1", gatewayRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
