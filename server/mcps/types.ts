export type McpDeploymentType = 'runtime-remote' | 'server-api-fallback' | 'dev-build-time';

export interface ProductionIntegrationStatus {
  configured: boolean;
  reachable: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
  error: string | null;
}

export interface McpToolDefinition {
  name: string;
  description: string;
}

export interface McpDefinition {
  id: string;
  name: string;
  category: 'flights' | 'weather' | 'currency' | 'hotels' | 'transit' | 'ai' | 'advisories' | 'remote';
  provider: string;
  description: string;
  endpoint: string;
  schemaVersion: string;
  deploymentType: McpDeploymentType;
  supportsStreamableHttp: boolean;
  tools: McpToolDefinition[];
  healthCheck: () => Promise<{
    configured: boolean;
    reachable: boolean;
    status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
    error: string | null;
    latencyMs?: number;
    details?: string;
  }>;
}

export interface HealthReportOnly {
  configured: boolean;
  reachable: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy';
  error: string | null;
}

export interface DetailedHealthReport extends HealthReportOnly {
  integrations?: Record<string, {
    configured: boolean;
    reachable: boolean;
    status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
    error: string | null;
    type?: string;
    latencyMs?: number;
  }>;
  mcps?: {
    id: string;
    name: string;
    category: string;
    provider: string;
    deploymentType: string;
    status: string;
    configured: boolean;
    reachable: boolean;
    latencyMs: number;
    error: string | null;
    toolsCount: number;
    tools: McpToolDefinition[];
  }[];
}
