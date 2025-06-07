// utils/AppError.ts
export default class ApiError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Mark custom errors as operational (expected)
    Error.captureStackTrace(this, this.constructor);
  }
}
