// src/app.ts
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import './config/passport';
import './lib/prisma'; // <- Ensure this runs at app startup
import errorHandler from './middlewares/errorHandler';
import authRouter from './routes/auth.routes';
import userRouter from './routes/users.routes';

import ApiError from './utils/apiError';

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

app.use(passport.initialize());

// Routes
app.use("/api", authRouter);
app.use("/api/user", userRouter);


// 404 handler
app.use((req, _, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
