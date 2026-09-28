import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Activity, ShieldCheck, RefreshCw, Server, Wrench, Layers } from 'lucide-react';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface McpItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  endpoint: string;
  status: 'Connected' | 'Degraded' | 'Offline';
  latencyMs: number;
  details?: string;
  toolsCount: number;
  tools?: { name: string; description: string }[];
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<{
    status: string;
    timestamp: string;
    departureHub: string;
    totalMcps: number;
    connectedCount: number;
    mcps: McpItem[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedMcpId, setExpandedMcpId] = useState<string | null>(null);

  async function loadHealth() {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-100">
                  MCP Architecture & Services Health
                </h3>
                {healthData && (
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    {healthData.connectedCount}/{healthData.totalMcps} Connected
                  </span>
                )}
              </div>
              <span className="text-xs text-neutral-400">
                Folder: <code className="text-amber-400 font-mono">/server/mcps/</code> · Singapore Changi (SIN) Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadHealth}
              disabled={loading}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors"
              title="Refresh"
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

        {/* Security & Architecture Notice */}
        <div className="mb-4 rounded-lg bg-neutral-900/60 p-3 text-xs text-neutral-400 border border-neutral-800 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-neutral-200">Server-Side MCP Isolation: </span>
            All MCP handlers reside in <code className="text-amber-300 font-mono">/server/mcps</code> and query live endpoints server-side. Zero secret variables or private credentials leak to browser client bundles.
          </div>
        </div>

        {/* MCP Modules List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {healthData?.mcps.map((item) => {
            const isExpanded = expandedMcpId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 p-3 text-xs transition-colors hover:border-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <div className="cursor-pointer" onClick={() => setExpandedMcpId(isExpanded ? null : item.id)}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-200">{item.name}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{item.provider}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-neutral-400 tabular-nums">
                      {item.latencyMs}ms
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium ${
                      item.status === 'Connected'
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/50'
                        : 'text-amber-400 bg-amber-950/60 border border-amber-800/50'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${item.status === 'Connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{item.status}</span>
                    </span>
                  </div>
                </div>

                {/* Sub details / tools */}
                <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="text-neutral-500 font-mono truncate max-w-xs">
                    {item.details || item.endpoint}
                  </span>
                  <button
                    onClick={() => setExpandedMcpId(isExpanded ? null : item.id)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Wrench className="h-3 w-3" />
                    <span>{item.toolsCount} MCP Tools {isExpanded ? '▲' : '▼'}</span>
                  </button>
                </div>

                {isExpanded && item.tools && (
                  <div className="mt-2.5 pt-2 border-t border-neutral-800/60 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Registered Tools:</span>
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
        <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Hub Origin: Singapore Changi (SIN)</span>
          <span>Checked: {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : 'Just now'}</span>
        </div>
      </div>
    </div>
  );
};
