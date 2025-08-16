import 'dotenv/config';
import express, { type Express } from 'express';

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT}`);
});
