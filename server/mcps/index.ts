import { McpDefinition, DetailedHealthReport, HealthReportOnly } from './types.js';
import { flightsMcp } from './flightsMcp.js';
import { weatherMcp } from './weatherMcp.js';
import { currencyMcp } from './currencyMcp.js';
import { hotelsMcp } from './hotelsMcp.js';
import { transitMcp } from './transitMcp.js';
import { aiAdvisorMcp } from './aiAdvisorMcp.js';
import { advisoriesMcp } from './advisoriesMcp.js';
import { remoteMcpDefinition, checkRemoteMcpReachability } from './remoteMcp.js';

export const ALL_MCPS: McpDefinition[] = [
  flightsMcp,
  weatherMcp,
  currencyMcp,
  hotelsMcp,
  transitMcp,
  aiAdvisorMcp,
  advisoriesMcp,
  remoteMcpDefinition
];

/**
 * Checks every required production integration.
 * In compliance with MCP Production Requirement #9:
 * Reports strictly:
 * - configured: true/false
 * - reachable: true/false
 * - status
 * - error
 * Never exposes credentials, tokens, or API keys.
 */
export async function runProductionHealthCheck(): Promise<DetailedHealthReport> {
  const mcpResults = await Promise.all(
    ALL_MCPS.map(async mcp => {
      try {
        const check = await mcp.healthCheck();
        return {
          id: mcp.id,
          name: mcp.name,
          category: mcp.category,
          provider: mcp.provider,
          deploymentType: mcp.deploymentType,
          configured: check.configured,
          reachable: check.reachable,
          status: check.status,
          latencyMs: check.latencyMs || 0,
          error: check.error || null,
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
          deploymentType: mcp.deploymentType,
          configured: false,
          reachable: false,
          status: 'unhealthy',
          latencyMs: 999,
          error: err?.message || 'Health probe failed',
          details: 'Error executing health check probe',
          toolsCount: mcp.tools.length,
          tools: mcp.tools
        };
      }
    })
  );

  // Build the clean integrations record where each integration strictly reports:
  // configured, reachable, status, error (no credentials)
  const integrations: Record<string, {
    configured: boolean;
    reachable: boolean;
    status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
    error: string | null;
  }> = {};

  for (const item of mcpResults) {
    integrations[item.id] = {
      configured: item.configured,
      reachable: item.reachable,
      status: item.status as any,
      error: item.error
    };
  }

  // Required production integrations: flights, weather, currency, hotels, transit, advisories, aiAdvisor
  // remoteMcp is optional (if configured via env, it must be reachable; if not configured, approved server API handles it)
  const requiredList = mcpResults.filter(m => m.id !== 'remote-mcp');
  const allRequiredConfigured = requiredList.every(m => m.configured);
  const allRequiredReachable = requiredList.every(m => m.reachable);

  const remoteStatus = mcpResults.find(m => m.id === 'remote-mcp');
  const hasRemoteIssue = remoteStatus?.configured && !remoteStatus?.reachable;

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  let overallError: string | null = null;

  if (!allRequiredConfigured || !allRequiredReachable) {
    const failed = requiredList.filter(m => !m.configured || !m.reachable);
    overallStatus = 'degraded';
    overallError = failed.map(f => `${f.name}: ${f.error || 'unreachable'}`).join('; ');
  } else if (hasRemoteIssue) {
    overallStatus = 'degraded';
    overallError = `Remote MCP configured but unreachable: ${remoteStatus?.error}`;
  }

  return {
    configured: allRequiredConfigured,
    reachable: allRequiredReachable,
    status: overallStatus,
    error: overallError,
    integrations,
    mcps: mcpResults
  };
}

/**
 * Returns strictly the top-level 4 fields required by requirement 9:
 * configured: true/false
 * reachable: true/false
 * status
 * error
 * Never exposes credentials.
 */
export async function getHealthReportOnly(): Promise<HealthReportOnly> {
  const full = await runProductionHealthCheck();
  return {
    configured: full.configured,
    reachable: full.reachable,
    status: full.status,
    error: full.error
  };
}
