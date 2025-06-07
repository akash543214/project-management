import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import cookieParser from "cookie-parser";

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from './routes/users.routes';
import ApiError from './utils/apiError';

app.use("/api", userRouter);
// Catch all unknown routes
app.use((req, _, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler middleware
app.use(errorHandler);

export default app;