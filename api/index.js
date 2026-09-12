import express from 'express';
import apiRouter from '../server/routes/api.js';
import { ensureSeeded } from '../server/seed.js';

ensureSeeded();

const app = express();
app.use(express.json({ limit: '32kb' }));
app.use('/api', apiRouter);

app.use((err, _req, res, _next) => {
  console.error('[api]', err.message);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

export default app;
