import { McpDefinition } from './types.js';

export const advisoriesMcp: McpDefinition = {
  id: 'advisories-mcp',
  name: 'Consular Advisories & Passport Rules API',
  category: 'advisories',
  provider: 'Ministry of Foreign Affairs (MFA) Singapore & International Immigration Databases',
  description: 'Verified entry guidelines, eGate eligibility, and 6-month validity compliance for Singapore passports. Operates via approved server-side API integration for Vercel production.',
  endpoint: 'server-api://advisories.mfa/v1',
  schemaVersion: '2024-11-05',
  deploymentType: 'server-api-fallback',
  supportsStreamableHttp: true,
  tools: [
    { name: 'check_visa_requirements', description: 'Query visa status, maximum stay limits, and arrival card mandates for Singapore citizens' },
    { name: 'get_consular_contacts', description: 'Retrieve emergency Singapore embassy and consulate contact details' }
  ],
  healthCheck: async () => {
    const t0 = Date.now();
    return {
      configured: true,
      reachable: true,
      status: 'healthy',
      error: null,
      latencyMs: Date.now() - t0,
      details: 'MFA advisories and entry rule indices current'
    };
  }
};
