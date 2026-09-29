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
  Search,
  MapPin,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Navbar } from './components/Navbar.js';
import { SearchHero } from './components/SearchHero.js';
import { DestinationCard } from './components/DestinationCard.js';
import { ComparisonModal } from './components/ComparisonModal.js';
import { TripDetailView } from './components/TripDetailView.js';
import { TravelAdvisorChat } from './components/TravelAdvisorChat.js';
import { SystemHealthModal } from './components/SystemHealthModal.js';
import { LocationSelectModal } from './components/LocationSelectModal.js';
import { DESTINATION_OPTIONS } from './components/LocationSelector.js';
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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

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

      if (query.destinationId && query.destinationId !== 'all') {
        params.append('destinationId', query.destinationId);
      }
      if (query.budget && query.budget > 0) {
        params.append('maxBudget', query.budget.toString());
      }
      if (query.preferredClimate && query.preferredClimate !== 'any') {
        params.append('climate', query.preferredClimate);
      }

      const res = await fetch(`/api/destinations?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.destinations) {
        setDestinations(prev => {
          if (query.destinationId && query.destinationId !== 'all') {
            const map = new Map(prev.map(d => [d.id, d]));
            data.destinations.forEach((d: IDestinationCard) => map.set(d.id, d));
            return Array.from(map.values());
          }
          return data.destinations;
        });
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

  const handleSelectLocation = (id: string, name?: string, navigateToDetail: boolean = false) => {
    if (id === 'all') {
      const next: UserSearchQuery = {
        ...searchQuery,
        destinationId: undefined,
        destinationName: undefined
      };
      setSearchQuery(next);
      setSelectedDestinationId(null);
      loadDestinations(next);
    } else {
      const next: UserSearchQuery = {
        ...searchQuery,
        destinationId: id,
        destinationName: name
      };
      setSearchQuery(next);
      if (navigateToDetail || selectedDestinationId) {
        setSelectedDestinationId(id);
      }
      loadDestinations(next);
    }
  };

  const handleSearchSubmit = (newQuery: UserSearchQuery) => {
    setSearchQuery(newQuery);
    if (newQuery.destinationId && newQuery.destinationId !== 'all') {
      setSelectedDestinationId(newQuery.destinationId);
    } else {
      setSelectedDestinationId(null);
    }
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

  // Filter destinations by category & tag & selected location
  let filteredDestinations = destinations;
  if (searchQuery.destinationId && searchQuery.destinationId !== 'all') {
    filteredDestinations = filteredDestinations.filter(d => d.id === searchQuery.destinationId);
  }
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

  // If loading a specific selected destination that isn't in memory yet
  if (selectedDestinationId && !selectedDestination && loadingDestinations) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        <p className="text-sm font-mono text-neutral-400">Loading trip itinerary & flights from Singapore Changi...</p>
      </div>
    );
  }

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
          selectedDestinationId={selectedDestination.id}
          onSelectDestination={(id, name) => handleSelectLocation(id, name, true)}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
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
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
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

        <LocationSelectModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          selectedId={selectedDestination.id}
          onSelect={(id, name) => handleSelectLocation(id, name, true)}
          currency={currency}
          exchangeRate={currentExchangeRate}
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

  const selectedDestInfo = destinations.find(d => d.id === searchQuery.destinationId);

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeNavTab}
          onSelectTab={tab => {
            setActiveNavTab(tab);
            if (tab === 'flights') {
              setSelectedDestinationId(searchQuery.destinationId || 'tokyo');
            } else if (tab === 'stays') {
              setSelectedDestinationId(searchQuery.destinationId || 'bangkok');
            } else if (tab === 'itinerary') {
              setSelectedDestinationId(searchQuery.destinationId || 'tokyo');
            } else if (tab === 'transport') {
              setSelectedDestinationId(searchQuery.destinationId || 'bangkok');
            } else if (tab === 'budget') {
              setSelectedDestinationId(searchQuery.destinationId || 'tokyo');
            }
          }}
          currency={currency}
          onCurrencyChange={setCurrency}
          onOpenAdvisor={() => setIsAdvisorOpen(true)}
          onOpenHealth={() => setIsHealthOpen(true)}
          compareCount={compareDestIds.length}
          onOpenCompare={() => setIsCompareModalOpen(true)}
          selectedDestinationId={selectedDestinationId || searchQuery.destinationId}
          onSelectDestination={handleSelectLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />

        {/* Hero Search Section */}
        <SearchHero
          searchQuery={searchQuery}
          onSearch={handleSearchSubmit}
          isLoading={loadingDestinations}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />

        {/* Selected Location Focus Banner */}
        {selectedDestInfo && (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-950 p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                      Location Selected
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {selectedDestInfo.code}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedDestInfo.name}, {selectedDestInfo.country}
                  </h3>
                  <span className="text-xs text-neutral-400">
                    {Math.floor(selectedDestInfo.flightDurationMinutes / 60)}h {selectedDestInfo.flightDurationMinutes % 60}m direct flight · Stays from {formatMoney(selectedDestInfo.estimatedHotelCostPerNightSGD?.mid || 95)}/night
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedDestinationId(selectedDestInfo.id)}
                  className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Full Itinerary & Flights</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-3 py-2 text-xs font-semibold text-amber-300 hover:text-white bg-amber-950/60 border border-amber-500/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span>Change Location</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLocation('all')}
                  className="px-3 py-2 text-xs text-neutral-400 hover:text-white border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  Show All Locations
                </button>
              </div>
            </div>
          </div>
        )}

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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-4">
          {/* Quick Location Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 border-b border-neutral-800/60">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <MapPin className="h-3 w-3 text-amber-400" />
              <span>Location:</span>
            </span>

            <button
              type="button"
              onClick={() => handleSelectLocation('all')}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors shrink-0 border cursor-pointer ${
                !searchQuery.destinationId || searchQuery.destinationId === 'all'
                  ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-xs'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Locations
            </button>

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors shrink-0 flex items-center gap-1.5 border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Select Location (Full Modal)</span>
            </button>

            {DESTINATION_OPTIONS.map(dest => {
              const isCurrent = searchQuery.destinationId === dest.id;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelectLocation(dest.id, `${dest.name}, ${dest.country}`)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 border cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-neutral-950 font-bold border-amber-300 shadow-xs'
                      : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <span>{dest.name}</span>
                  <span className={`text-[10px] font-mono ${isCurrent ? 'text-neutral-900' : 'text-amber-400'}`}>
                    {dest.code}
                  </span>
                </button>
              );
            })}
          </div>

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

      {/* Floating Quick Location Selector Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-2xl transition-all hover:scale-105 border border-amber-300 cursor-pointer"
          title="Select or switch location you want to go"
        >
          <MapPin className="h-4 w-4" />
          <span>
            {searchQuery.destinationId ? `Location: ${searchQuery.destinationName?.split(',')[0] || searchQuery.destinationId.toUpperCase()}` : 'Select Location'}
          </span>
        </button>
      </div>

      {/* Destination Location Selection Modal */}
      <LocationSelectModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedId={selectedDestinationId || searchQuery.destinationId}
        onSelect={(id, name) => handleSelectLocation(id, name, false)}
        currency={currency}
        exchangeRate={currentExchangeRate}
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
