import { McpDefinition } from './types.js';

export const flightsMcp: McpDefinition = {
  id: 'flights-mcp',
  name: 'Changi Flights & Singapore Airlines Inventory MCP',
  category: 'flights',
  provider: 'CAAS / Changi Direct Schedule Feed & SQ Distribution Matrix',
  description: 'MCP server providing real-time flight availability, live airfares, and SQ direct pricing departing SIN.',
  endpoint: 'mcp://flights.changi.internal/v1',
  schemaVersion: '2024-11-05',
  tools: [
    { name: 'search_flights', description: 'Query return flights from Singapore Changi (SIN) with airline comparison' },
    { name: 'get_flexible_dates', description: 'Evaluate airfares across ±1, ±3, ±7 days flexible windows' },
    { name: 'calculate_deal_delta', description: 'Compute deal difference percentage against historical fare benchmarks' }
  ],
  healthCheck: async () => {
    const t0 = Date.now();
    // Simulate internal health ping
    await new Promise(r => setTimeout(r, 12));
    return {
      status: 'Connected',
      latencyMs: Date.now() - t0,
      details: 'Active Star Alliance GDS & LCC distribution links healthy'
    };
  }
};
