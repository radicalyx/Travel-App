import express, { Request, Response } from 'express';
import { apiRouter } from './routes.js';
import healthHandler from './health.js';

const app = express();

app.use(express.json());

// CORS configuration for Vercel Serverless functions
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Dedicated health endpoint route
app.get('/health', (req, res) => healthHandler(req, res));
app.get('/api/health', (req, res) => healthHandler(req, res));

// Mount main API routes both at '/' and '/api' for Vercel rewrite compatibility
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Export both the Express app and the serverless handler for Vercel
export { app };

export default function handler(req: any, res: any) {
  return app(req, res);
}
