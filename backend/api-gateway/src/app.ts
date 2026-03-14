import cors from "cors";
import express from "express";
import helmet from "helmet";

import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { rateLimiterMiddleware } from "./middlewares/rateLimiter.middleware";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware";
import gatewayRoutes from "./routes/index";

const app = express();

app.use(helmet());
app.use(cors());

app.use((req, _res, next) => {
  console.log(`[GATEWAY] ${req.method} ${req.url}`);
  next();
});

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(rateLimiterMiddleware);

app.use("/api/v1", gatewayRoutes);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway is running",
  });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
