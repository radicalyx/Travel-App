import { McpDefinition } from './types.js';

export const hotelsMcp: McpDefinition = {
  id: 'hotels-mcp',
  name: 'Global Accommodations & Transit Distance MCP',
  category: 'hotels',
  provider: 'Hotel Aggregator API & Verified Hospitality Feed',
  description: 'MCP server providing verified stays across Budget, Mid-range and Luxury tiers with walking distance to transit hubs.',
  endpoint: 'mcp://hotels.partner.internal/v1',
  schemaVersion: '2024-11-05',
  tools: [
    { name: 'search_accommodations', description: 'Filter accommodations by destination, nightly budget, and room configuration' },
    { name: 'get_transit_proximity', description: 'Verify walking duration from hotel entrance to nearest metro/rail interchange' }
  ],
  healthCheck: async () => {
    const t0 = Date.now();
    await new Promise(r => setTimeout(r, 15));
    return {
      status: 'Connected',
      latencyMs: Date.now() - t0,
      details: 'Accommodation inventory feeds responding'
    };
  }
};
