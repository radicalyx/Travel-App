import { McpDefinition } from './types.js';
import { flightsMcp } from './flightsMcp.js';
import { weatherMcp } from './weatherMcp.js';
import { currencyMcp } from './currencyMcp.js';
import { hotelsMcp } from './hotelsMcp.js';
import { transitMcp } from './transitMcp.js';
import { aiAdvisorMcp } from './aiAdvisorMcp.js';
import { advisoriesMcp } from './advisoriesMcp.js';

export const ALL_MCPS: McpDefinition[] = [
  flightsMcp,
  weatherMcp,
  currencyMcp,
  hotelsMcp,
  transitMcp,
  aiAdvisorMcp,
  advisoriesMcp
];

export interface McpSystemHealthSummary {
  status: 'healthy' | 'degraded' | 'offline';
  timestamp: string;
  departureHub: string;
  totalMcps: number;
  connectedCount: number;
  mcps: {
    id: string;
    name: string;
    category: string;
    provider: string;
    endpoint: string;
    status: 'Connected' | 'Degraded' | 'Offline';
    latencyMs: number;
    details?: string;
    toolsCount: number;
    tools: { name: string; description: string }[];
  }[];
}

export async function runMcpHealthChecks(): Promise<McpSystemHealthSummary> {
  const results = await Promise.all(
    ALL_MCPS.map(async mcp => {
      try {
        const check = await mcp.healthCheck();
        return {
          id: mcp.id,
          name: mcp.name,
          category: mcp.category,
          provider: mcp.provider,
          endpoint: mcp.endpoint,
          status: check.status,
          latencyMs: check.latencyMs,
          details: check.details,
          toolsCount: mcp.tools.length,
          tools: mcp.tools
        };
      } catch (err: any) {
        return {
          id: mcp.id,
          name: mcp.name,
          category: mcp.category,
          provider: mcp.provider,
          endpoint: mcp.endpoint,
          status: 'Degraded' as const,
          latencyMs: 999,
          details: err?.message || 'Check timed out',
          toolsCount: mcp.tools.length,
          tools: mcp.tools
        };
      }
    })
  );

  const connectedCount = results.filter(r => r.status === 'Connected').length;
  const isHealthy = connectedCount === results.length;

  return {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    departureHub: 'Singapore Changi Airport (SIN)',
    totalMcps: results.length,
    connectedCount,
    mcps: results
  };
}
