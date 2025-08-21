import 'dotenv/config';
import express, { type Express } from 'express';
import { userRouter, itemRouter, categoryRouter } from '@routes/index.route';

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/panel/v1/users', userRouter);
app.use('/panel/v1/items', itemRouter);
app.use('/panel/v1/categories', categoryRouter);

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});
