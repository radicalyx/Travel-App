import { McpDefinition } from './types.js';

export interface RemoteMcpRuntimeStatus {
  configured: boolean;
  reachable: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
  error: string | null;
  supportsStreamableHttp: boolean;
  latencyMs?: number;
  details?: string;
  toolConfig?: {
    type: 'mcp_server';
    name: string;
    url: string;
    headers?: Record<string, string>;
  };
}

export function getRemoteMcpConfig(): RemoteMcpRuntimeStatus {
  const url = process.env.MCP_SERVER_URL || process.env.REMOTE_MCP_URL;
  if (!url || !url.trim()) {
    return {
      configured: false,
      reachable: false,
      status: 'not_configured',
      error: null,
      supportsStreamableHttp: false,
      details: 'No runtime MCP server configured; using approved server-side API integrations on Vercel'
    };
  }

  try {
    const parsed = new URL(url.trim());
    const isStreamableHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:';

    if (!isStreamableHttp) {
      return {
        configured: true,
        reachable: false,
        status: 'unhealthy',
        error: `MCP server protocol '${parsed.protocol}' is unsupported. Gemini Remote MCP requires Streamable HTTP (http:// or https://).`,
        supportsStreamableHttp: false,
        details: 'Protocol must be http:// or https://'
      };
    }

    const token = process.env.MCP_AUTH_TOKEN || process.env.MCP_SERVER_AUTH_TOKEN;
    const toolConfig: {
      type: 'mcp_server';
      name: string;
      url: string;
      headers?: Record<string, string>;
    } = {
      type: 'mcp_server',
      name: 'WanderSinRemoteMcp',
      url: url.trim(),
      headers: token ? { Authorization: `Bearer ${token.trim()}` } : undefined
    };

    return {
      configured: true,
      reachable: true,
      status: 'healthy',
      error: null,
      supportsStreamableHttp: true,
      details: 'Remotely accessible Streamable HTTP MCP server configured',
      toolConfig
    };
  } catch (err: any) {
    return {
      configured: true,
      reachable: false,
      status: 'unhealthy',
      error: `Invalid MCP_SERVER_URL configuration: ${err.message}`,
      supportsStreamableHttp: false,
      details: 'Malformed URL in environment variable'
    };
  }
}

export async function checkRemoteMcpReachability(): Promise<RemoteMcpRuntimeStatus> {
  const config = getRemoteMcpConfig();
  if (!config.configured || !config.toolConfig) {
    return config;
  }

  const t0 = Date.now();
  try {
    const headers: Record<string, string> = {
      'Accept': 'text/event-stream, application/json, text/plain'
    };
    if (config.toolConfig.headers?.Authorization) {
      headers['Authorization'] = config.toolConfig.headers.Authorization;
    }

    const res = await fetch(config.toolConfig.url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(3500)
    });

    const latencyMs = Date.now() - t0;
    const ok = res.status < 500; // 2xx, 3xx, or 4xx auth response indicates server is reachable

    return {
      ...config,
      reachable: ok,
      latencyMs,
      status: ok ? 'healthy' : 'unhealthy',
      error: ok ? null : `Remote MCP returned HTTP status ${res.status}`,
      details: ok ? `Streamable HTTP MCP reachable (${latencyMs}ms)` : `HTTP ${res.status}`
    };
  } catch (err: any) {
    return {
      ...config,
      reachable: false,
      latencyMs: Date.now() - t0,
      status: 'unhealthy',
      error: `Remote MCP server unreachable: ${err.message || 'connection timeout'}`,
      details: 'Network connection failed'
    };
  }
}

export const remoteMcpDefinition: McpDefinition = {
  id: 'remote-mcp',
  name: 'Remote Streamable HTTP MCP Server',
  category: 'remote',
  provider: 'Configured via MCP_SERVER_URL',
  description: 'Optional runtime remotely accessible MCP server using Streamable HTTP transport for Gemini Interactions API. Never connected directly from browser.',
  endpoint: process.env.MCP_SERVER_URL || 'not-configured',
  schemaVersion: '2024-11-05',
  deploymentType: 'runtime-remote',
  supportsStreamableHttp: true,
  tools: [
    { name: 'remote_mcp_call', description: 'Invoke remote MCP tools via Gemini Interactions API server-side' }
  ],
  healthCheck: async () => {
    return await checkRemoteMcpReachability();
  }
};
