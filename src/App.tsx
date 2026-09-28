import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plane,
  Clock,
  Sparkles,
  TrendingDown,
  DollarSign,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search
} from 'lucide-react';
import { Navbar } from './components/Navbar.js';
import { SearchHero } from './components/SearchHero.js';
import { DestinationCard } from './components/DestinationCard.js';
import { ComparisonModal } from './components/ComparisonModal.js';
import { TripDetailView } from './components/TripDetailView.js';
import { TravelAdvisorChat } from './components/TravelAdvisorChat.js';
import { SystemHealthModal } from './components/SystemHealthModal.js';
import {
  DestinationCard as IDestinationCard,
  UserSearchQuery,
  DistanceCategory,
  ActivityTag
} from './types/travel.js';

export default function App() {
  // Navigation & View state
  const [activeNavTab, setActiveNavTab] = useState<string>('explore');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState<UserSearchQuery>({
    origin: 'SIN',
    originCity: 'Singapore',
    departureDate: '2026-11-12',
    returnDate: '2026-11-18',
    adults: 2,
    children: 0,
    cabinClass: 'economy',
    budget: 4000, // SGD 4,000 default for 2 travellers
    travelStyle: 'balanced',
    preferredClimate: 'any',
    activities: ['food', 'city', 'culture'],
    hotelCategory: 'mid',
    carRentalRequired: false,
    directOnly: false,
    flexibleDays: 3
  });

  // Destinations & Filtering state
  const [destinations, setDestinations] = useState<IDestinationCard[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState<boolean>(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | DistanceCategory>('all');
  const [activeTagFilter, setActiveTagFilter] = useState<string>('all');

  // Comparison state (up to 4 destinations)
  const [compareDestIds, setCompareDestIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Modals & Drawers
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);
  const [isHealthOpen, setIsHealthOpen] = useState<boolean>(false);

  // Currency & Exchange Rates
  const [currency, setCurrency] = useState<string>('SGD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ SGD: 1 });
  const [fxTimestamp, setFxTimestamp] = useState<string>('');

  // 1. Fetch live currency rates on load
  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch('/api/currency');
        const data = await res.json();
        if (data.success && data.rates) {
          setExchangeRates(data.rates);
          setFxTimestamp(data.retrievedAt);
        }
      } catch (err) {
        console.error('Failed to load currency rates:', err);
      }
    }
    loadRates();
  }, []);

  // 2. Fetch destination matrix based on search query
  const loadDestinations = async (query: UserSearchQuery) => {
    setLoadingDestinations(true);
    try {
      const start = new Date(query.departureDate);
      const end = new Date(query.returnDate);
      const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const totalPax = query.adults + query.children;

      const params = new URLSearchParams({
        travellers: totalPax.toString(),
        days: days.toString(),
        directOnly: query.directOnly ? 'true' : 'false'
      });

      if (query.budget && query.budget > 0) {
        params.append('maxBudget', query.budget.toString());
      }
      if (query.preferredClimate && query.preferredClimate !== 'any') {
        params.append('climate', query.preferredClimate);
      }

      const res = await fetch(`/api/destinations?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.destinations) {
        setDestinations(data.destinations);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoadingDestinations(false);
    }
  };

  useEffect(() => {
    loadDestinations(searchQuery);
  }, []);

  const handleSearchSubmit = (newQuery: UserSearchQuery) => {
    setSearchQuery(newQuery);
    setSelectedDestinationId(null);
    loadDestinations(newQuery);
  };

  const handleToggleCompare = (id: string) => {
    setCompareDestIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const currentExchangeRate = exchangeRates[currency] || 1;

  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * currentExchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  // Filter destinations by category & tag
  let filteredDestinations = destinations;
  if (activeCategoryFilter !== 'all') {
    filteredDestinations = filteredDestinations.filter(d => d.category === activeCategoryFilter);
  }
  if (activeTagFilter !== 'all') {
    filteredDestinations = filteredDestinations.filter(d => d.tags.includes(activeTagFilter as any));
  }

  // Segment by Distance using the FILTERED list so filters actually take effect
  const nearbyDests = filteredDestinations.filter(d => d.category === 'nearby');
  const midDests = filteredDestinations.filter(d => d.category === 'mid');
  const farDests = filteredDestinations.filter(d => d.category === 'far');

  const selectedDestination = destinations.find(d => d.id === selectedDestinationId);

  // If a destination is currently being viewed in detail
  if (selectedDestination) {
    return (
      <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100">
        <Navbar
          activeTab={activeNavTab}
          onSelectTab={tab => {
            setActiveNavTab(tab);
            if (tab === 'explore') {
              setSelectedDestinationId(null);
            }
          }}
          currency={currency}
          onCurrencyChange={setCurrency}
          onOpenAdvisor={() => setIsAdvisorOpen(true)}
          onOpenHealth={() => setIsHealthOpen(true)}
          compareCount={compareDestIds.length}
          onOpenCompare={() => setIsCompareModalOpen(true)}
        />

        <TripDetailView
          destination={selectedDestination}
          searchQuery={searchQuery}
          currency={currency}
          exchangeRate={currentExchangeRate}
          initialTab={
            activeNavTab === 'flights'
              ? 'flights'
              : activeNavTab === 'stays'
              ? 'hotels'
              : activeNavTab === 'itinerary'
              ? 'itinerary'
              : activeNavTab === 'transport'
              ? 'transit'
              : activeNavTab === 'budget'
              ? 'budget'
              : 'overview'
          }
          onBack={() => {
            setSelectedDestinationId(null);
            setActiveNavTab('explore');
          }}
          onUpdateSearchQuery={updated => {
            const next = { ...searchQuery, ...updated };
            setSearchQuery(next);
            loadDestinations(next);
          }}
        />

        <TravelAdvisorChat
          isOpen={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
          currentDestination={selectedDestination.name}
          travelDates={{ start: searchQuery.departureDate, end: searchQuery.returnDate }}
          budget={searchQuery.budget}
        />

        <SystemHealthModal
          isOpen={isHealthOpen}
          onClose={() => setIsHealthOpen(false)}
        />

        <ComparisonModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          destinations={destinations.filter(d => compareDestIds.includes(d.id))}
          currency={currency}
          exchangeRate={currentExchangeRate}
          onSelectDestination={id => {
            setSelectedDestinationId(id);
            setIsCompareModalOpen(false);
          }}
          onRemoveDestination={handleToggleCompare}
        />
      </div>
    );
  }

  const tagsList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Experiences' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'city', label: 'City Hubs' },
    { id: 'beach', label: 'Beach & Island' },
    { id: 'culture', label: 'Culture & Shrines' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'family', label: 'Family Friendly' }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeNavTab}
          onSelectTab={tab => {
            setActiveNavTab(tab);
            if (tab === 'flights') {
              setSelectedDestinationId('tokyo');
            } else if (tab === 'stays') {
              setSelectedDestinationId('bangkok');
            } else if (tab === 'itinerary') {
              setSelectedDestinationId('tokyo');
            } else if (tab === 'transport') {
              setSelectedDestinationId('bangkok');
            } else if (tab === 'budget') {
              setSelectedDestinationId('tokyo');
            }
          }}
          currency={currency}
          onCurrencyChange={setCurrency}
          onOpenAdvisor={() => setIsAdvisorOpen(true)}
          onOpenHealth={() => setIsHealthOpen(true)}
          compareCount={compareDestIds.length}
          onOpenCompare={() => setIsCompareModalOpen(true)}
        />

        {/* Hero Search Section */}
        <SearchHero
          searchQuery={searchQuery}
          onSearch={handleSearchSubmit}
          isLoading={loadingDestinations}
        />

        {/* Budget-First Discovery Notification Banner */}
        {searchQuery.budget && searchQuery.budget > 0 && (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <DollarSign className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Budget-First Discovery Active
                  </div>
                  <div className="text-sm font-semibold text-neutral-200">
                    Showing destinations feasible within {formatMoney(searchQuery.budget)} for {searchQuery.adults + searchQuery.children} travellers
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSearchSubmit({ ...searchQuery, budget: undefined })}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 underline self-start sm:self-center"
              >
                Clear Budget Cap
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-4">
            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto scrollbar-none">
              {(['all', 'nearby', 'mid', 'far'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors whitespace-nowrap ${
                    activeCategoryFilter === cat
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {cat === 'all'
                    ? 'All Distances'
                    : cat === 'nearby'
                    ? 'Nearby (< 4h)'
                    : cat === 'mid'
                    ? 'Mid-Distance (4–8h)'
                    : 'Far (> 8h)'}
                </button>
              ))}
            </div>

            {/* Tag Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {tagsList.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setActiveTagFilter(tag.id)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap ${
                    activeTagFilter === tag.id
                      ? 'border-amber-400/80 bg-amber-500/10 text-amber-300 font-semibold'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 space-y-12">
          {loadingDestinations ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
              <p className="text-sm text-neutral-400 font-mono">
                Searching live Changi departure inventory & Singapore Airlines schedules...
              </p>
            </div>
          ) : destinations.length === 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 text-center space-y-3">
              <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-neutral-100">
                No Destinations Found for Current Budget
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                No destinations currently fit the total budget cap of {formatMoney(searchQuery.budget || 0)} for {searchQuery.adults + searchQuery.children} travellers. Try adjusting your budget or selecting a shorter trip.
              </p>
              <button
                onClick={() => handleSearchSubmit({ ...searchQuery, budget: undefined })}
                className="mt-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
              >
                Reset Budget Filter
              </button>
            </div>
          ) : (
            <>
              {/* CATEGORY 1: NEARBY (< 4 HOURS) */}
              {(activeCategoryFilter === 'all' || activeCategoryFilter === 'nearby') && nearbyDests.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-neutral-800/80 pb-2">
                    <div>
                      <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Flight Duration: Under 4 Hours
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
                        Nearby Getaways
                      </h2>
                    </div>
                    <span className="text-xs text-neutral-500 hidden sm:inline">
                      Short flights · Minimal jetlag · High weekend flexibility
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nearbyDests.map(dest => (
                      <DestinationCard
                        key={dest.id}
                        destination={dest}
                        currency={currency}
                        exchangeRate={currentExchangeRate}
                        onSelect={setSelectedDestinationId}
                        isSelectedForCompare={compareDestIds.includes(dest.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* CATEGORY 2: MID-DISTANCE (4 - 8 HOURS) */}
              {(activeCategoryFilter === 'all' || activeCategoryFilter === 'mid') && midDests.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-neutral-800/80 pb-2">
                    <div>
                      <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Flight Duration: 4 – 8 Hours
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
                        Mid-Distance Discoveries
                      </h2>
                    </div>
                    <span className="text-xs text-neutral-500 hidden sm:inline">
                      East Asia & Australia · World-class rail networks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {midDests.map(dest => (
                      <DestinationCard
                        key={dest.id}
                        destination={dest}
                        currency={currency}
                        exchangeRate={currentExchangeRate}
                        onSelect={setSelectedDestinationId}
                        isSelectedForCompare={compareDestIds.includes(dest.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* CATEGORY 3: FAR (> 8 HOURS) */}
              {(activeCategoryFilter === 'all' || activeCategoryFilter === 'far') && farDests.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-neutral-800/80 pb-2">
                    <div>
                      <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Flight Duration: Over 8 Hours
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
                        Long-Haul Escapes
                      </h2>
                    </div>
                    <span className="text-xs text-neutral-500 hidden sm:inline">
                      Direct flagship flights · Europe & Intercontinental
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farDests.map(dest => (
                      <DestinationCard
                        key={dest.id}
                        destination={dest}
                        currency={currency}
                        exchangeRate={currentExchangeRate}
                        onSelect={setSelectedDestinationId}
                        isSelectedForCompare={compareDestIds.includes(dest.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Bottom Comparison Bar if any selected */}
      {compareDestIds.length > 0 && (
        <aside aria-label="Selected destinations" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl rounded-xl border border-amber-500/50 bg-neutral-950/95 p-3 shadow-2xl backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-neutral-950">
              {compareDestIds.length}
            </span>
            <div className="text-xs font-medium text-neutral-200">
              Destinations selected for side-by-side comparison
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareDestIds([])}
              className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Compare Now
            </button>
          </div>
        </aside>
      )}

      {/* AI Advisor Chat Drawer */}
      <TravelAdvisorChat
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        travelDates={{ start: searchQuery.departureDate, end: searchQuery.returnDate }}
        budget={searchQuery.budget}
      />

      {/* Developer / System Health Modal */}
      <SystemHealthModal
        isOpen={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        destinations={destinations.filter(d => compareDestIds.includes(d.id))}
        currency={currency}
        exchangeRate={currentExchangeRate}
        onSelectDestination={id => {
          setSelectedDestinationId(id);
          setIsCompareModalOpen(false);
        }}
        onRemoveDestination={handleToggleCompare}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 text-neutral-500 text-xs">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-amber-400" />
            <span className="font-semibold text-neutral-300">WanderSIN</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Singapore Departure Planner</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Changi Hub Schedule Feed</span>
            <span aria-hidden="true">·</span>
            <span>MAS & Live FX Rates {fxTimestamp ? `(${new Date(fxTimestamp).toLocaleTimeString()})` : ''}</span>
            <span aria-hidden="true">·</span>
            <span>Data Transparency Guaranteed</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
