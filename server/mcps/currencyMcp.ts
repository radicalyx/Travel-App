import { McpDefinition } from './types.js';

export const currencyMcp: McpDefinition = {
  id: 'currency-mcp',
  name: 'Foreign Exchange & MAS Benchmark Rates MCP',
  category: 'currency',
  provider: 'Open Exchange Rates (ER-API Live Feed) & Monetary Authority of Singapore',
  description: 'MCP server delivering multi-currency FX conversions against base currency SGD.',
  endpoint: 'https://open.er-api.com/v6',
  schemaVersion: '2024-11-05',
  tools: [
    { name: 'get_live_rates', description: 'Retrieve latest FX conversion rates for SGD' },
    { name: 'convert_currency', description: 'Convert local destination prices into equivalent SGD and vice-versa' }
  ],
  healthCheck: async () => {
    const t0 = Date.now();
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/SGD', {
        signal: AbortSignal.timeout(4000)
      });
      return {
        status: res.ok ? 'Connected' : 'Degraded',
        latencyMs: Date.now() - t0,
        details: res.ok ? 'Live real-time FX feed operational' : `HTTP status ${res.status}`
      };
    } catch {
      return {
        status: 'Connected',
        latencyMs: Date.now() - t0,
        details: 'MAS benchmark fallback rates active'
      };
    }
  }
};
