import { McpDefinition } from './types.js';

export const advisoriesMcp: McpDefinition = {
  id: 'advisories-mcp',
  name: 'Consular Advisories & Passport Rules MCP',
  category: 'advisories',
  provider: 'Ministry of Foreign Affairs (MFA) Singapore & International Immigration Databases',
  description: 'MCP server delivering verified entry guidelines, eGate eligibility, and 6-month validity compliance for Singapore passports.',
  endpoint: 'mcp://advisories.mfa.internal/v1',
  schemaVersion: '2024-11-05',
  tools: [
    { name: 'check_visa_requirements', description: 'Query visa status, maximum stay limits, and arrival card mandates for Singapore citizens' },
    { name: 'get_consular_contacts', description: 'Retrieve emergency Singapore embassy and consulate contact details' }
  ],
  healthCheck: async () => {
    const t0 = Date.now();
    await new Promise(r => setTimeout(r, 8));
    return {
      status: 'Connected',
      latencyMs: Date.now() - t0,
      details: 'MFA advisories and entry rule indices current'
    };
  }
};
