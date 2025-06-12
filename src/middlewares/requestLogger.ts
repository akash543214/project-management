// middleware/requestLogger.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function requestLogger(methodsToLog: string[] = ["DELETE"]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const shouldLog = methodsToLog.includes(req.method.toUpperCase());
    const start = Date.now();

    res.on("finish", () => {
      if (!shouldLog) return;

      const duration = Date.now() - start;
      const user = (req as any).user || {};

      logger.info("API Request", {
        method: req.method,
        route: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        userId: user.id || "Unauthenticated",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        timestamp: new Date().toISOString(),
      });
    });

    next();
  };
}
