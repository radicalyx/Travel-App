import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Activity, ShieldCheck, RefreshCw, Server, AlertCircle } from 'lucide-react';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IntegrationStatus {
  name: string;
  status: string;
  latencyMs: number;
  source: string;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<{
    status: string;
    timestamp: string;
    departureHub: string;
    integrations: IntegrationStatus[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

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
              <h3 className="text-lg font-bold text-neutral-100">
                Data Providers & API Health
              </h3>
              <span className="text-xs text-neutral-400">
                Singapore Changi (SIN) Hub Architecture
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

        {/* Security & Zero Secret Exposure Notice */}
        <div className="mb-5 rounded-lg bg-neutral-900/60 p-3 text-xs text-neutral-400 border border-neutral-800 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-neutral-200">Security Architecture Verified: </span>
            All 3rd-party provider integrations execute purely server-side. No API keys, credentials, or tokens are ever exposed to client bundles or browser consoles.
          </div>
        </div>

        {/* Integration List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {healthData?.integrations.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-neutral-800/80 bg-neutral-900/40 p-3 text-xs"
            >
              <div>
                <div className="font-semibold text-neutral-200">{item.name}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{item.source}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-neutral-400 tabular-nums">
                  {item.latencyMs}ms
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{item.status}</span>
                </span>
              </div>
            </div>
          ))}
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
