import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Activity, ShieldCheck, RefreshCw, Server, Wrench, Globe, Check, AlertCircle } from 'lucide-react';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface McpTool {
  name: string;
  description: string;
}

interface McpItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  deploymentType: 'runtime-remote' | 'server-api-fallback' | 'dev-build-time' | string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured' | string;
  configured: boolean;
  reachable: boolean;
  latencyMs: number;
  error: string | null;
  details?: string;
  toolsCount: number;
  tools?: McpTool[];
}

interface HealthData {
  configured: boolean;
  reachable: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy' | string;
  error: string | null;
  mcps?: McpItem[];
  integrations?: Record<string, {
    configured: boolean;
    reachable: boolean;
    status: string;
    error: string | null;
  }>;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedMcpId, setExpandedMcpId] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  async function loadHealth() {
    setLoading(true);
    try {
      const res = await fetch('/api/health?details=true');
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      console.error('Failed to load health status:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isHealthy = healthData?.status === 'healthy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${
              isHealthy
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-100">
                  Production MCP & Architecture Health
                </h3>
                {healthData && (
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isHealthy
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                  }`}>
                    {healthData.status.toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs text-neutral-400">
                Endpoint: <code className="text-amber-400 font-mono">/api/health</code> · Zero Credentials Exposed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigGuide(!showConfigGuide)}
              className="px-2.5 py-1 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white transition-colors"
            >
              {showConfigGuide ? 'Hide Guide' : 'Vercel / Secrets Guide'}
            </button>
            <button
              onClick={loadHealth}
              disabled={loading}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors"
              title="Refresh Health"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Primary Health Probe Summary (Requirement #9 Contract) */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2.5 text-center">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">configured</span>
            <span className={`text-xs font-bold font-mono ${healthData?.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
              {String(healthData?.configured ?? '...')}
            </span>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2.5 text-center">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">reachable</span>
            <span className={`text-xs font-bold font-mono ${healthData?.reachable ? 'text-emerald-400' : 'text-amber-400'}`}>
              {String(healthData?.reachable ?? '...')}
            </span>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2.5 text-center">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">status</span>
            <span className={`text-xs font-bold font-mono ${isHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
              {healthData?.status ?? '...'}
            </span>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2.5 text-center truncate">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">error</span>
            <span className="text-xs font-mono text-neutral-300 truncate" title={healthData?.error || 'null'}>
              {healthData?.error ? healthData.error : 'null'}
            </span>
          </div>
        </div>

        {/* Configuration Guide Accordion */}
        {showConfigGuide && (
          <div className="mb-4 rounded-lg bg-neutral-900/90 border border-amber-500/30 p-3.5 text-xs text-neutral-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Server className="h-4 w-4" />
              <span>Production MCP & Secrets Provisioning Checklist:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-1 text-[11px]">
              <li>
                <strong className="text-neutral-200">Google AI Studio Secrets:</strong> Set <code className="text-amber-300 font-mono">GEMINI_API_KEY</code> for development & preview.
              </li>
              <li>
                <strong className="text-neutral-200">Vercel Environment Variables:</strong> Set <code className="text-amber-300 font-mono">GEMINI_API_KEY</code> separately in Vercel project dashboard.
              </li>
              <li>
                <strong className="text-neutral-200">Remote MCP (Optional):</strong> Set <code className="text-amber-300 font-mono">MCP_SERVER_URL</code> (must use Streamable HTTP: <code className="text-amber-300 font-mono">https://...</code>) and optional <code className="text-amber-300 font-mono">MCP_AUTH_TOKEN</code>.
              </li>
              <li>
                <strong className="text-neutral-200">Server-Side Isolation:</strong> No MCP servers or tokens are contacted or stored from React browser code.
              </li>
              <li>
                <strong className="text-neutral-200">Vercel Server-Side Fallback:</strong> If no external MCP server is configured, approved native server-side API integrations operate smoothly on Vercel.
              </li>
            </ul>
          </div>
        )}

        {/* Security & Architecture Badges */}
        <div className="mb-4 rounded-lg bg-neutral-900/40 p-2.5 text-xs text-neutral-400 border border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-neutral-300">100% Server-Side MCP Isolation · Never exposes tokens to browser</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <Check className="h-3.5 w-3.5" />
            <span>Streamable HTTP Ready</span>
          </div>
        </div>

        {/* MCP & Server-Side Integration Modules */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {healthData?.mcps?.map((item) => {
            const isExpanded = expandedMcpId === item.id;
            const itemOk = item.status === 'healthy' || item.status === 'Connected';
            const isRemote = item.deploymentType === 'runtime-remote';

            return (
              <div
                key={item.id}
                className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 p-3 text-xs transition-colors hover:border-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <div className="cursor-pointer" onClick={() => setExpandedMcpId(isExpanded ? null : item.id)}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-200">{item.name}</span>
                      <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                        isRemote
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800/40'
                          : 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                      }`}>
                        {isRemote ? 'Remote MCP' : 'Server API (Vercel)'}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{item.provider}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-neutral-400 tabular-nums">
                      {item.latencyMs}ms
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium ${
                      itemOk
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/50'
                        : item.status === 'not_configured'
                        ? 'text-neutral-400 bg-neutral-900 border border-neutral-700'
                        : 'text-amber-400 bg-amber-950/60 border border-amber-800/50'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        itemOk ? 'bg-emerald-400 animate-pulse' : item.status === 'not_configured' ? 'bg-neutral-500' : 'bg-amber-400'
                      }`} />
                      <span>{item.status}</span>
                    </span>
                  </div>
                </div>

                {/* Sub details */}
                <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="text-neutral-500 font-mono truncate max-w-xs">
                    {item.details || (item.error ? `Error: ${item.error}` : 'Operational')}
                  </span>
                  <button
                    onClick={() => setExpandedMcpId(isExpanded ? null : item.id)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Wrench className="h-3 w-3" />
                    <span>{item.toolsCount} Tools {isExpanded ? '▲' : '▼'}</span>
                  </button>
                </div>

                {/* Tool descriptions */}
                {isExpanded && item.tools && (
                  <div className="mt-2.5 pt-2 border-t border-neutral-800/60 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Registered MCP Tools / Handlers:</span>
                    {item.tools.map((t, idx) => (
                      <div key={idx} className="bg-neutral-950/80 rounded p-1.5 border border-neutral-800/40 text-[11px]">
                        <span className="font-mono font-bold text-amber-300">{t.name}</span>
                        <p className="text-neutral-400 text-[10px] mt-0.5">{t.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Singapore Changi (SIN) Hub Origin</span>
          <span>Probe format: <code className="text-neutral-400 font-mono">configured, reachable, status, error</code></span>
        </div>
      </div>
    </div>
  );
};
