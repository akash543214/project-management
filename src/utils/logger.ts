// utils/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} ${level.toUpperCase()} ${message} ${JSON.stringify(meta)}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
