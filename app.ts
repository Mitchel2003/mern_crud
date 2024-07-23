import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import authRoutes from './routes/auth.routes';

const app = express();
app.use(morgan('dev'));
app.use('/api', authRoutes);
app.use(express.json());
app.use(cors);

export default app;