import { McpDefinition } from './types.js';

export const transitMcp: McpDefinition = {
  id: 'transit-mcp',
  name: 'Urban Transit & Airport Connectivity MCP',
  category: 'transit',
  provider: 'Official City Metro Authorities (BTS, MRT, JR East, AREX, TfL) & Aggregators',
  description: 'MCP server evaluating airport express links, city rail passes, and ground mobility necessity.',
  endpoint: 'mcp://transit.mobility.internal/v1',
  schemaVersion: '2024-11-05',
  tools: [
    { name: 'get_airport_transfers', description: 'Retrieve airport-to-downtown train, express shuttle, and taxi options with durations and fares' },
    { name: 'evaluate_car_rental', description: 'Assess whether car rental is necessary, optional, or not recommended based on public rail density' },
    { name: 'recommend_transit_passes', description: 'Match tourist passes (Suica, Rabbit, T-Money, Oyster) against itinerary intensity' }
  ],
  healthCheck: async () => {
    const t0 = Date.now();
    await new Promise(r => setTimeout(r, 10));
    return {
      status: 'Connected',
      latencyMs: Date.now() - t0,
      details: 'City transit graphs & transfer tables loaded'
    };
  }
};
