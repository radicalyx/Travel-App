import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X, Check, Globe, ChevronDown, Plane, Sparkles } from 'lucide-react';

export interface DestinationOption {
  id: string;
  name: string;
  country: string;
  code: string;
  category: 'nearby' | 'mid' | 'far';
  categoryLabel: string;
  flightDuration: string;
  startFareSGD: number;
  highlightTag: string;
}

export const DESTINATION_OPTIONS: DestinationOption[] = [
  // Nearby (< 4 hours)
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    code: 'BKK',
    category: 'nearby',
    categoryLabel: 'Southeast Asia (< 4h)',
    flightDuration: '2h 25m direct',
    startFareSGD: 195,
    highlightTag: 'Street Food & Nightlife'
  },
  {
    id: 'bali',
    name: 'Bali (Denpasar)',
    country: 'Indonesia',
    code: 'DPS',
    category: 'nearby',
    categoryLabel: 'Southeast Asia (< 4h)',
    flightDuration: '2h 45m direct',
    startFareSGD: 185,
    highlightTag: 'Beaches & Cliff Clubs'
  },
  {
    id: 'phuket',
    name: 'Phuket',
    country: 'Thailand',
    code: 'HKT',
    category: 'nearby',
    categoryLabel: 'Southeast Asia (< 4h)',
    flightDuration: '1h 50m direct',
    startFareSGD: 155,
    highlightTag: 'Island Hopping & Diving'
  },
  {
    id: 'kualalumpur',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    code: 'KUL',
    category: 'nearby',
    categoryLabel: 'Southeast Asia (< 4h)',
    flightDuration: '55m direct',
    startFareSGD: 75,
    highlightTag: 'Petronas & Street Food'
  },
  {
    id: 'penang',
    name: 'Penang',
    country: 'Malaysia',
    code: 'PEN',
    category: 'nearby',
    categoryLabel: 'Southeast Asia (< 4h)',
    flightDuration: '1h 25m direct',
    startFareSGD: 85,
    highlightTag: 'UNESCO George Town & Hawker Eats'
  },
  {
    id: 'danang',
    name: 'Da Nang & Hoi An',
    country: 'Vietnam',
    code: 'DAD',
    category: 'nearby',
    categoryLabel: 'Southeast Asia (< 4h)',
    flightDuration: '2h 50m direct',
    startFareSGD: 210,
    highlightTag: 'Lantern Town & Beaches'
  },
  {
    id: 'hochiminh',
    name: 'Ho Chi Minh City',
    country: 'Vietnam',
    code: 'SGN',
    category: 'nearby',
    categoryLabel: 'Southeast Asia (< 4h)',
    flightDuration: '2h 10m direct',
    startFareSGD: 135,
    highlightTag: 'Coffee Culture & Street Food'
  },

  // Mid-Distance (4 - 8 hours)
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    code: 'NRT/HND',
    category: 'mid',
    categoryLabel: 'East Asia (4–8h)',
    flightDuration: '7h 00m direct',
    startFareSGD: 480,
    highlightTag: 'Culinary & City Lights'
  },
  {
    id: 'osaka',
    name: 'Osaka & Kyoto',
    country: 'Japan',
    code: 'KIX',
    category: 'mid',
    categoryLabel: 'East Asia (4–8h)',
    flightDuration: '6h 30m direct',
    startFareSGD: 420,
    highlightTag: 'USJ & Historic Temples'
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    code: 'ICN',
    category: 'mid',
    categoryLabel: 'East Asia (4–8h)',
    flightDuration: '6h 30m direct',
    startFareSGD: 420,
    highlightTag: 'K-Culture & Shopping'
  },
  {
    id: 'taipei',
    name: 'Taipei',
    country: 'Taiwan',
    code: 'TPE',
    category: 'mid',
    categoryLabel: 'East Asia (4–8h)',
    flightDuration: '4h 45m direct',
    startFareSGD: 260,
    highlightTag: 'Night Markets & Jiufen'
  },
  {
    id: 'hongkong',
    name: 'Hong Kong',
    country: 'China',
    code: 'HKG',
    category: 'mid',
    categoryLabel: 'East Asia (4–8h)',
    flightDuration: '4h 00m direct',
    startFareSGD: 220,
    highlightTag: 'Victoria Peak & Dim Sum'
  },
  {
    id: 'perth',
    name: 'Perth & Rottnest',
    country: 'Australia',
    code: 'PER',
    category: 'mid',
    categoryLabel: 'Australia (5–8h)',
    flightDuration: '5h 15m direct',
    startFareSGD: 310,
    highlightTag: 'Quokkas & Coastal Sunsets'
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    code: 'SYD',
    category: 'mid',
    categoryLabel: 'Australia (5–8h)',
    flightDuration: '7h 45m direct',
    startFareSGD: 395,
    highlightTag: 'Harbour Bridge & Bondi'
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australia',
    code: 'MEL',
    category: 'mid',
    categoryLabel: 'Australia (5–8h)',
    flightDuration: '7h 25m direct',
    startFareSGD: 385,
    highlightTag: 'Laneways & Great Ocean Road'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    code: 'DXB',
    category: 'mid',
    categoryLabel: 'Middle East (7h)',
    flightDuration: '7h 20m direct',
    startFareSGD: 590,
    highlightTag: 'Burj Khalifa & Desert Safari'
  },

  // Far (> 8 hours)
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    code: 'LHR',
    category: 'far',
    categoryLabel: 'Long-Haul (> 8h)',
    flightDuration: '13h 50m direct',
    startFareSGD: 1080,
    highlightTag: 'West End & Royal Sights'
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    code: 'CDG',
    category: 'far',
    categoryLabel: 'Long-Haul (> 8h)',
    flightDuration: '13h 40m direct',
    startFareSGD: 890,
    highlightTag: 'Eiffel Tower & Louvre'
  },
  {
    id: 'zurich',
    name: 'Zurich & Swiss Alps',
    country: 'Switzerland',
    code: 'ZRH',
    category: 'far',
    categoryLabel: 'Long-Haul (> 8h)',
    flightDuration: '13h 20m direct',
    startFareSGD: 1090,
    highlightTag: 'Alpine Panoramas & Trains'
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    code: 'FCO',
    category: 'far',
    categoryLabel: 'Long-Haul (> 8h)',
    flightDuration: '12h 55m direct',
    startFareSGD: 840,
    highlightTag: 'Colosseum & Vatican'
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    code: 'AMS',
    category: 'far',
    categoryLabel: 'Long-Haul (> 8h)',
    flightDuration: '13h 30m direct',
    startFareSGD: 860,
    highlightTag: 'Canals & Rijksmuseum'
  }
];

interface LocationSelectorProps {
  selectedId?: string; // destination ID or 'all' or empty
  onSelect: (destId: string, destName?: string) => void;
  onOpenModal?: () => void;
  variant?: 'hero' | 'nav' | 'compact';
  label?: string;
  currency?: string;
  exchangeRate?: number;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedId,
  onSelect,
  onOpenModal,
  variant = 'hero',
  label = 'WHERE TO / DESTINATION',
  currency = 'SGD',
  exchangeRate = 1
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchFilter('');
    }
  }, [isOpen]);

  const selectedDestination = DESTINATION_OPTIONS.find(
    d => d.id === selectedId || d.id === selectedId?.toLowerCase()
  );

  const filteredOptions = DESTINATION_OPTIONS.filter(dest => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      dest.name.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      dest.code.toLowerCase().includes(q) ||
      dest.highlightTag.toLowerCase().includes(q)
    );
  });

  const categories = [
    { key: 'nearby', label: 'Southeast Asia (< 4h Flight)' },
    { key: 'mid', label: 'East Asia (4–8h Flight)' },
    { key: 'far', label: 'Long-Haul (> 8h Flight)' }
  ] as const;

  const handleChoose = (id: string, name?: string) => {
    onSelect(id, name);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect('all', undefined);
  };

  // Nav variant styling
  if (variant === 'nav') {
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            selectedDestination
              ? 'bg-amber-950/50 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
          }`}
          title="Select Destination Location"
        >
          <MapPin className="h-3.5 w-3.5 text-amber-400" />
          <span className="truncate max-w-[130px]">
            {selectedDestination ? `${selectedDestination.name} (${selectedDestination.code})` : 'Select Location'}
          </span>
          <ChevronDown className={`h-3 w-3 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-80 rounded-xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
            {/* Search filter input */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
              <input
                ref={inputRef}
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search city, code, country..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/90 pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Any Location option */}
            <button
              type="button"
              onClick={() => handleChoose('all')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors mb-1 ${
                !selectedDestination
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-amber-400" />
                <span>Any Destination (All Locations)</span>
              </div>
              {!selectedDestination && <Check className="h-3.5 w-3.5" />}
            </button>

            {/* Custom city input if user types something not in list */}
            {searchFilter.trim().length > 1 && !filteredOptions.some(d => d.name.toLowerCase() === searchFilter.toLowerCase().trim()) && (
              <button
                type="button"
                onClick={() => handleChoose(searchFilter.trim().toLowerCase(), searchFilter.trim())}
                className="w-full flex items-center justify-between p-2 text-xs rounded-lg transition-colors mb-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span className="truncate">Go to "{searchFilter.trim()}"</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono">Custom →</span>
              </button>
            )}

            {/* Destination options list */}
            <div className="max-h-64 overflow-y-auto space-y-1 divide-y divide-neutral-900 pr-1">
              {filteredOptions.map(dest => {
                const isSelected = selectedDestination?.id === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => handleChoose(dest.id, `${dest.name}, ${dest.country}`)}
                    className={`w-full flex items-center justify-between p-2 text-left text-xs rounded-lg transition-colors pt-2 ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                        : 'text-neutral-200 hover:bg-neutral-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-neutral-100">{dest.name}</span>
                        <span className="font-mono text-[10px] text-amber-400 px-1 py-0.2 rounded bg-neutral-900 border border-neutral-800">
                          {dest.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">{dest.country} · {dest.flightDuration}</span>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-400">
                      from SGD {dest.startFareSGD}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Link to Full Modal */}
            {onOpenModal && (
              <div className="pt-2 mt-1 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); onOpenModal(); }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  <span>Browse All in Full Modal...</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Hero form variant styling
  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="text-xs font-medium text-neutral-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-amber-400" />
          <span>{label}</span>
        </span>
        <div className="flex items-center gap-2">
          {onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
            >
              <Sparkles className="h-3 w-3" />
              <span>Browse All</span>
            </button>
          )}
          {selectedDestination && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center gap-0.5"
              title="Clear selection to discover all destinations"
            >
              <span>Reset</span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </label>

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm text-left transition-colors focus:outline-none ${
          selectedDestination
            ? 'border-amber-500/60 bg-neutral-950 text-neutral-100 shadow-xs'
            : 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedDestination ? (
            <>
              <span className="font-bold text-amber-400 font-mono text-xs px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-500/30">
                {selectedDestination.code}
              </span>
              <div className="truncate">
                <span className="font-semibold text-neutral-100 mr-1.5 truncate">
                  {selectedDestination.name}
                </span>
                <span className="text-xs text-neutral-400 truncate hidden sm:inline">
                  ({selectedDestination.country})
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-neutral-400">
              <Globe className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="truncate">Any Destination (Discover All)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedDestination && (
            <span
              onClick={handleClear}
              className="p-1 text-neutral-400 hover:text-amber-400 rounded transition-colors"
              title="Clear destination"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-neutral-800 bg-neutral-950/95 backdrop-blur-xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 min-w-[320px] max-w-md">
          {/* Quick Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search city, airport code, country..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/90 pl-9 pr-8 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-medium"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Custom city input if user types something not in list */}
          {searchFilter.trim().length > 1 && !filteredOptions.some(d => d.name.toLowerCase() === searchFilter.toLowerCase().trim()) && (
            <div className="mb-2 pb-2 border-b border-neutral-900">
              <button
                type="button"
                onClick={() => handleChoose(searchFilter.trim().toLowerCase(), searchFilter.trim())}
                className="w-full flex items-center justify-between p-2.5 text-xs rounded-lg transition-colors bg-gradient-to-r from-amber-500/20 to-neutral-900 border border-amber-500/40 text-amber-300 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <div className="text-left">
                    <span className="block font-bold">Fly to "{searchFilter.trim()}"</span>
                    <span className="text-[10px] text-neutral-400 block font-normal">Custom Destination · Singapore Flights & AI Daily Plan</span>
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-bold shrink-0">Plan Trip →</span>
              </button>
            </div>
          )}

          {/* Any Destination option */}
          <div className="mb-2 pb-2 border-b border-neutral-900">
            <button
              type="button"
              onClick={() => handleChoose('all')}
              className={`w-full flex items-center justify-between p-2.5 text-xs rounded-lg transition-colors ${
                !selectedDestination
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-900 border border-neutral-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`h-6 w-6 rounded-md flex items-center justify-center ${!selectedDestination ? 'bg-neutral-950 text-amber-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <span className="block font-semibold">Any Destination (Discover All)</span>
                  <span className={`text-[11px] block ${!selectedDestination ? 'text-neutral-800' : 'text-neutral-400'}`}>
                    Surprise me with best fares and itineraries from Changi
                  </span>
                </div>
              </div>
              {!selectedDestination && <Check className="h-4 w-4" />}
            </button>
          </div>

          {/* Grouped Destination Options */}
          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-400">
                <span>No matching destinations found for "{searchFilter}".</span>
              </div>
            ) : (
              categories.map(cat => {
                const groupItems = filteredOptions.filter(d => d.category === cat.key);
                if (groupItems.length === 0) return null;

                return (
                  <div key={cat.key} className="space-y-1">
                    <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider px-2 block">
                      {cat.label}
                    </span>
                    <div className="space-y-1">
                      {groupItems.map(dest => {
                        const isSelected = selectedDestination?.id === dest.id;
                        return (
                          <button
                            key={dest.id}
                            type="button"
                            onClick={() => handleChoose(dest.id, `${dest.name}, ${dest.country}`)}
                            className={`w-full flex items-center justify-between p-2 text-left rounded-lg text-xs transition-colors ${
                              isSelected
                                ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                                : 'text-neutral-200 hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-neutral-950 text-amber-400'
                                  : 'bg-neutral-900 text-amber-300 border border-neutral-800'
                              }`}>
                                {dest.code}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold">{dest.name}</span>
                                  <span className={`text-[11px] ${isSelected ? 'text-neutral-800 font-medium' : 'text-neutral-400'}`}>
                                    · {dest.country}
                                  </span>
                                </div>
                                <span className={`text-[10px] block ${isSelected ? 'text-neutral-800' : 'text-neutral-400'}`}>
                                  {dest.flightDuration} · {dest.highlightTag}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`font-mono font-semibold block text-xs ${isSelected ? 'text-neutral-950' : 'text-amber-400'}`}>
                                SGD {Math.round(dest.startFareSGD * exchangeRate)}
                              </span>
                              <span className={`text-[9px] block ${isSelected ? 'text-neutral-800' : 'text-neutral-500'}`}>
                                return from
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Full Modal Explorer Trigger */}
          {onOpenModal && (
            <div className="pt-2 mt-2 border-t border-neutral-900">
              <button
                type="button"
                onClick={() => { setIsOpen(false); onOpenModal(); }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Open Full Destination Explorer Modal</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
