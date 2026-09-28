export interface McpHealthCheckResult {
  latencyMs: number;
  status: 'Connected' | 'Degraded' | 'Offline';
  details?: string;
}

export interface McpDefinition {
  id: string;
  name: string;
  category: 'flights' | 'weather' | 'currency' | 'hotels' | 'transit' | 'ai' | 'advisories';
  provider: string;
  description: string;
  endpoint: string;
  schemaVersion: string;
  tools: {
    name: string;
    description: string;
  }[];
  healthCheck: () => Promise<McpHealthCheckResult>;
}
