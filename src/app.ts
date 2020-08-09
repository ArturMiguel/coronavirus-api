import express from 'express';
import cors from 'cors';
import router from './router';

import scraper from './scraper/index';

const app = express();

app.use(cors());
app.set('x-powered-by', false);
app.use('/api/v1', router);

scraper();

setInterval(() => scraper(), 1000 * 60 * 60 * 4);

export default app;
