import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { services } from "../config/services";
import { logger } from "../config/logger";

const router = express.Router();

const createServiceProxy = (
  target: string,
  serviceName: string,
  basePath: string,
) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => `${basePath}${path}`,
    proxyTimeout: 10000,
    timeout: 10000,
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${target}${proxyReq.path}`,
        );
        const expressReq = req as express.Request;
        if (expressReq.requestId) {
          proxyReq.setHeader("x-request-id", expressReq.requestId);
        }
      },
      error: (err, req, res) => {
        const expressReq = req as express.Request;
        logger.error(
          `[${expressReq.requestId ?? "N/A"}] Proxy error in ${serviceName}: ${err.message}`,
        );

        if ("writeHead" in res) {
          const response = res as express.Response;
          if (!response.headersSent) {
            response.writeHead(502, { "Content-Type": "application/json" });
          }

          response.end(
            JSON.stringify({
              success: false,
              message: `${serviceName} is unavailable`,
            }),
          );
        } else {
          res.end();
        }
      },
    },
  });

router.use("/auth", createServiceProxy(services.auth, "auth-service", "/auth"));
router.use(
  "/users",
  createServiceProxy(services.user, "user-service", "/users"),
);
router.use("/jobs", createServiceProxy(services.job, "job-service", "/jobs"));
router.use(
  "/applications",
  createServiceProxy(
    services.application,
    "application-service",
    "/applications",
  ),
);
router.use(
  "/companies",
  createServiceProxy(services.company, "company-service", "/companies"),
);
router.use(
  "/notifications",
  createServiceProxy(
    services.notification,
    "notification-service",
    "/notifications",
  ),
);
router.use(
  "/search",
  createServiceProxy(services.search, "search-service", "/search"),
);
router.use("/ai", createServiceProxy(services.ai, "ai-service", "/ai"));

export default router;
