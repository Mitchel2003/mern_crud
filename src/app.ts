import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config"

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

export default app;
