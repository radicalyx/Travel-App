import React from 'react';
import { Compass, Sparkles, Activity, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  onOpenAdvisor: () => void;
  onOpenHealth: () => void;
  compareCount: number;
  onOpenCompare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currency,
  onCurrencyChange,
  onOpenAdvisor,
  onOpenHealth,
  compareCount,
  onOpenCompare
}) => {
  const currencies = ['SGD', 'USD', 'JPY', 'THB', 'IDR', 'GBP', 'EUR', 'MYR', 'KRW'];

  const navLinks = [
    { id: 'explore', label: 'Explore' },
    { id: 'flights', label: 'Flights' },
    { id: 'stays', label: 'Stays' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'transport', label: 'Transit' },
    { id: 'budget', label: 'Budget' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onSelectTab('explore')}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-neutral-100">
              WanderSIN
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`transition-colors hover:text-neutral-100 ${
                activeTab === link.id
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5'
                  : 'text-neutral-400'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Comparison Trigger if any selected */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-lg hover:bg-amber-900/40 transition-colors"
            >
              <span>Compare ({compareCount})</span>
            </button>
          )}

          {/* Currency Switcher */}
          <div className="relative flex items-center text-xs">
            <label htmlFor="currency-select" className="sr-only">Currency</label>
            <select
              id="currency-select"
              value={currency}
              onChange={e => onCurrencyChange(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              {currencies.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* System Health Check button */}
          <button
            onClick={onOpenHealth}
            title="System & API Source Health Status"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>Health</span>
          </button>

          {/* AI Travel Advisor Button */}
          <button
            onClick={onOpenAdvisor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-semibold shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">AI Advisor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
