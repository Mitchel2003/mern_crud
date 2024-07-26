import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

export default app;