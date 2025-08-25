import 'dotenv/config';
import express, { type Express } from 'express';
import {
    userRouter,
    itemRouter,
    categoryRouter,
    authRouter,
} from '@routes/index.route';
import errorHandler from 'middlewares/errorHandler';

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5000;
const BASE_API_ROUTE: string = '/panel/v1';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(`${BASE_API_ROUTE}/auth`, authRouter);
app.use(`${BASE_API_ROUTE}/users`, userRouter);
app.use(`${BASE_API_ROUTE}/items`, itemRouter);
app.use(`${BASE_API_ROUTE}/categories`, categoryRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});
