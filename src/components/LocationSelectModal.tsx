import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  X,
  Check,
  Globe,
  Sparkles,
  Plane,
  Clock,
  Compass,
  Shuffle,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { DESTINATION_OPTIONS, DestinationOption } from './LocationSelector.js';

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId?: string | null;
  onSelect: (destId: string, destName?: string) => void;
  currency?: string;
  exchangeRate?: number;
}

export const LocationSelectModal: React.FC<LocationSelectModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
  currency = 'SGD',
  exchangeRate = 1
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [surpriseAlert, setSurpriseAlert] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);
    } else {
      setSearchQuery('');
      setSurpriseAlert(null);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatPrice = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()}`;
  };

  const regions = [
    { id: 'all', label: 'All Regions', count: DESTINATION_OPTIONS.length },
    { id: 'nearby', label: 'Southeast Asia (< 4h)', count: DESTINATION_OPTIONS.filter(d => d.category === 'nearby').length },
    { id: 'east-asia', label: 'East Asia (4–8h)', count: DESTINATION_OPTIONS.filter(d => ['tokyo', 'osaka', 'seoul', 'taipei', 'hongkong'].includes(d.id)).length },
    { id: 'oceania', label: 'Oceania & Australia', count: DESTINATION_OPTIONS.filter(d => ['sydney', 'melbourne', 'perth'].includes(d.id)).length },
    { id: 'europe', label: 'Europe & Long-Haul', count: DESTINATION_OPTIONS.filter(d => ['london', 'zurich', 'paris', 'rome', 'amsterdam'].includes(d.id)).length },
    { id: 'middle-east', label: 'Middle East', count: DESTINATION_OPTIONS.filter(d => d.id === 'dubai').length }
  ];

  const tags = [
    { id: 'all', label: 'All Vibes' },
    { id: 'food', label: 'Street Food & Dining' },
    { id: 'beach', label: 'Beaches & Islands' },
    { id: 'culture', label: 'Temples & Heritage' },
    { id: 'city', label: 'Metropolis & Shopping' },
    { id: 'nature', label: 'Nature & Panoramas' },
    { id: 'family', label: 'Family Friendly' }
  ];

  // Filtering logic
  const filteredDestinations = DESTINATION_OPTIONS.filter(dest => {
    // 1. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        dest.name.toLowerCase().includes(q) ||
        dest.country.toLowerCase().includes(q) ||
        dest.code.toLowerCase().includes(q) ||
        dest.highlightTag.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Region filter
    if (selectedRegion === 'nearby' && dest.category !== 'nearby') return false;
    if (selectedRegion === 'east-asia' && !['tokyo', 'osaka', 'seoul', 'taipei', 'hongkong'].includes(dest.id)) return false;
    if (selectedRegion === 'oceania' && !['sydney', 'melbourne', 'perth'].includes(dest.id)) return false;
    if (selectedRegion === 'europe' && !['london', 'zurich', 'paris', 'rome', 'amsterdam'].includes(dest.id)) return false;
    if (selectedRegion === 'middle-east' && dest.id !== 'dubai') return false;

    // 3. Tag filter
    if (selectedTag !== 'all') {
      const textToSearch = (dest.highlightTag + ' ' + dest.name + ' ' + dest.country).toLowerCase();
      if (selectedTag === 'food' && !textToSearch.includes('food') && !textToSearch.includes('culinary') && !textToSearch.includes('dining')) return false;
      if (selectedTag === 'beach' && !textToSearch.includes('beach') && !textToSearch.includes('island') && !textToSearch.includes('coast')) return false;
      if (selectedTag === 'culture' && !textToSearch.includes('culture') && !textToSearch.includes('temple') && !textToSearch.includes('lantern') && !textToSearch.includes('heritage')) return false;
      if (selectedTag === 'city' && !textToSearch.includes('city') && !textToSearch.includes('shopping') && !textToSearch.includes('lights') && !textToSearch.includes('west end')) return false;
      if (selectedTag === 'nature' && !textToSearch.includes('alpine') && !textToSearch.includes('nature') && !textToSearch.includes('island') && !textToSearch.includes('quokka')) return false;
    }

    return true;
  });

  const handleSelectCity = (id: string, name?: string) => {
    onSelect(id, name);
    onClose();
  };

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * DESTINATION_OPTIONS.length);
    const randomDest = DESTINATION_OPTIONS[randomIndex];
    setSurpriseAlert(`Surprise Pick: ${randomDest.name}, ${randomDest.country}!`);
    setTimeout(() => {
      onSelect(randomDest.id, `${randomDest.name}, ${randomDest.country}`);
      onClose();
    }, 700);
  };

  const isCustomCitySearch = searchQuery.trim().length > 1 && filteredDestinations.length === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-950 p-4 sm:p-6 shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5" />
              <span>Singapore Changi Departure Hub</span>
              <span aria-hidden="true">·</span>
              <span>Direct Route Discovery</span>
            </div>
            <h2 id="location-modal-title" className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
              Select Destination Location
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Choose your destination to get instant verified flights, accommodations, and tailored itineraries from Singapore.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Surprise Me Button */}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Pick a random exciting destination"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Surprise Me!</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 transition-colors"
              aria-label="Close location selector"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Surprise Toast Notification */}
        {surpriseAlert && (
          <div className="mb-3 p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2 animate-pulse shrink-0">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{surpriseAlert} Loading itinerary and live flights...</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-3 shrink-0">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by city (e.g. Tokyo, Paris, Bali), country, or airport code (HND, LHR, CDG, BKK)..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 pl-10 pr-9 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-200"
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Region & Tag Filters Strip */}
        <div className="space-y-2 mb-3 shrink-0">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {regions.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedRegion === r.id
                    ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-xs'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <span>{r.label}</span>
                {r.count > 0 && (
                  <span className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${selectedRegion === r.id ? 'bg-neutral-950 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    {r.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Vibe Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3 text-amber-400" />
              <span>Vibe:</span>
            </span>
            {tags.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTag(t.id)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap border transition-colors cursor-pointer ${
                  selectedTag === t.id
                    ? 'border-amber-400/80 bg-amber-500/10 text-amber-300 font-semibold'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action: Clear Filter / Select Any Destination Option */}
        <div className="mb-3 pb-3 border-b border-neutral-800/80 shrink-0 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleSelectCity('all')}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs transition-colors border cursor-pointer ${
              !selectedId || selectedId === 'all'
                ? 'bg-amber-400 text-neutral-950 font-bold border-amber-300 shadow-xs'
                : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4" />
            <div className="text-left">
              <span className="block font-semibold">Any Destination (Explore All Getaways)</span>
              <span className={`text-[10px] block ${!selectedId || selectedId === 'all' ? 'text-neutral-800' : 'text-neutral-400'}`}>
                Discover seasonal fares and top deals across all countries from Changi
              </span>
            </div>
            {(!selectedId || selectedId === 'all') && <Check className="h-4 w-4 ml-auto" />}
          </button>

          <span className="text-xs text-neutral-400 font-mono">
            {filteredDestinations.length} destination{filteredDestinations.length === 1 ? '' : 's'} available
          </span>
        </div>

        {/* Custom City Quick Action if user typed a custom city */}
        {isCustomCitySearch && (
          <div className="mb-4 p-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-neutral-900 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Custom Destination Generator</span>
                </div>
                <h4 className="text-base font-bold text-neutral-100">
                  Fly from Singapore to "{searchQuery.trim()}"
                </h4>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Plan a custom trip with estimated Changi flights, hotels, transit, and AI daily itinerary tailored for {searchQuery.trim()}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSelectCity(searchQuery.trim().toLowerCase(), searchQuery.trim())}
                className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                Select & Plan "{searchQuery.trim()}"
              </button>
            </div>
          </div>
        )}

        {/* Destination Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {filteredDestinations.length === 0 && !isCustomCitySearch ? (
            <div className="p-8 text-center space-y-2 border border-dashed border-neutral-800 rounded-xl">
              <Compass className="h-8 w-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-semibold text-neutral-300">
                No matching destinations found
              </div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No predefined city matches "{searchQuery}". Try searching for another city, or type your desired location to generate a custom itinerary.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedRegion('all'); setSelectedTag('all'); }}
                className="mt-2 px-3 py-1.5 text-xs text-amber-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDestinations.map(dest => {
                const isSelected = selectedId === dest.id;
                return (
                  <div
                    key={dest.id}
                    onClick={() => handleSelectCity(dest.id, `${dest.name}, ${dest.country}`)}
                    className={`group relative rounded-xl border p-3.5 transition-all text-left cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/30 shadow-md ring-1 ring-amber-400/50'
                        : 'border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900'
                    }`}
                  >
                    <div>
                      {/* Top Bar: Code & Duration */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-amber-400 text-neutral-950'
                              : 'bg-neutral-950 text-amber-400 border border-neutral-800'
                          }`}>
                            {dest.code}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-400">
                            SIN → {dest.code}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                            <Check className="h-3.5 w-3.5" />
                            <span>Selected</span>
                          </div>
                        )}
                      </div>

                      {/* Name & Country */}
                      <div className="mb-2">
                        <h4 className="text-base font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                          {dest.name}
                        </h4>
                        <span className="text-xs text-neutral-400 block">
                          {dest.country} · {dest.flightDuration}
                        </span>
                      </div>

                      {/* Highlight Tag */}
                      <div className="inline-block text-[10px] font-medium text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded mb-3">
                        {dest.highlightTag}
                      </div>
                    </div>

                    {/* Bottom Pricing & Selection */}
                    <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase">Return from Changi</span>
                        <span className="font-mono text-xs font-bold text-neutral-200">
                          {formatPrice(dest.startFareSGD)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleSelectCity(dest.id, `${dest.name}, ${dest.country}`);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-800 text-neutral-200 hover:bg-amber-400 hover:text-neutral-950'
                        }`}
                      >
                        <span>{isSelected ? 'Active' : 'Select'}</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 shrink-0 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Plane className="h-3.5 w-3.5 text-amber-400" />
            <span>Real CAAS / Changi flight inventory & SIA direct schedules</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
