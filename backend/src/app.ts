import 'dotenv/config';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import errorHandler from 'middlewares/errorHandler';
import { userRouter, itemRouter, categoryRouter, authRouter } from '@routes/index.route';

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5000;
const BASE_API_ROUTE: string = '/panel/v1';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true}));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60 * 1000, limit: 10}));
app.use(`${BASE_API_ROUTE}/auth`, authRouter);
app.use(`${BASE_API_ROUTE}/users`, userRouter);
app.use(`${BASE_API_ROUTE}/items`, itemRouter);
app.use(`${BASE_API_ROUTE}/categories`, categoryRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});
