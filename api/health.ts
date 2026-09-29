import type { Request, Response } from 'express';
import { runProductionHealthCheck } from './mcps/index.js';

/**
 * Vercel Serverless Function Handler for `/api/health`
 *
 * In compliance with MCP Production Requirement #9 & Vercel Serverless Function spec:
 * - Checks every production integration and MCP
 * - Reports strictly: configured, reachable, status, error (no credentials leaked)
 * - If ?details=true or ?verbose=true is specified, includes integrations and mcps breakdowns
 * - Supports Vercel Serverless Functions, Express middleware, and standard Node HTTP
 */
export default async function handler(req: any, res: any) {
  // Enable permissive CORS for health status monitoring & dashboard calls
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  }

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  try {
    const report = await runProductionHealthCheck();
    const query = req.query || {};
    const wantsDetails = query.details === 'true' || query.verbose === 'true';

    const statusCode = report.status === 'unhealthy' ? 503 : 200;
    const payload = wantsDetails
      ? {
          configured: report.configured,
          reachable: report.reachable,
          status: report.status,
          error: report.error,
          integrations: report.integrations,
          mcps: report.mcps
        }
      : {
          configured: report.configured,
          reachable: report.reachable,
          status: report.status,
          error: report.error
        };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(statusCode).json(payload);
    }

    if (res.setHeader) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.statusCode = statusCode;
    return res.end(JSON.stringify(payload));
  } catch (error: any) {
    const errorPayload = {
      configured: false,
      reachable: false,
      status: 'unhealthy',
      error: error?.message || 'Production health probe failed'
    };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(500).json(errorPayload);
    }

    if (res.setHeader) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.statusCode = 500;
    return res.end(JSON.stringify(errorPayload));
  }
}
