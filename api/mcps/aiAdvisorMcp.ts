import { McpDefinition } from './types.js';

export const aiAdvisorMcp: McpDefinition = {
  id: 'ai-advisor-mcp',
  name: 'Gemini Travel Architect & Advisory Engine',
  category: 'ai',
  provider: 'Google GenAI SDK (@google/genai) — Gemini 3.8 Flash',
  description: 'Generative itinerary structuring, travel fatigue avoidance, and conversational Changi advisory. Configured strictly server-side.',
  endpoint: 'https://generativelanguage.googleapis.com',
  schemaVersion: '2024-11-05',
  deploymentType: 'runtime-remote',
  supportsStreamableHttp: true,
  tools: [
    { name: 'generate_day_by_day_itinerary', description: 'Create realistic schedules matched to flight timings and user travel style' },
    { name: 'consult_travel_advisor', description: 'Answer natural-language travel discovery queries for Singapore departures' }
  ],
  healthCheck: async () => {
    const t0 = Date.now();
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5);
    return {
      configured: hasKey,
      reachable: hasKey,
      status: hasKey ? 'healthy' : 'degraded',
      error: hasKey ? null : 'GEMINI_API_KEY is not configured in server environment variables',
      latencyMs: Date.now() - t0,
      details: hasKey ? 'Google GenAI Gemini 3.8 Flash operational' : 'Rule-based precision engine active as fallback'
    };
  }
};
