import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import applicationRoutes from "./routes/application.route.js";
import { env } from "./config/env.js";
import { requestContextMiddleware } from "./middlewares/requestContext.middleware.js";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";

const app = express();

app.use(requestContextMiddleware);
app.use(requestLoggerMiddleware);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Application service is healthy" });
});

app.use("/api/v1/applications", applicationRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
