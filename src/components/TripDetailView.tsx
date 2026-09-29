import React, { useState } from 'react';
import {
  ArrowLeft,
  Plane,
  Building2,
  Calendar,
  Train,
  Car,
  DollarSign,
  Compass,
  CloudSun,
  ShieldCheck,
  Share2,
  Check,
  MapPin
} from 'lucide-react';
import { DestinationCard as IDestinationCard, UserSearchQuery, AirlineOption } from '../types/travel.js';
import { FlightDealsSection } from './FlightDealsSection.js';
import { AccommodationsSection } from './AccommodationsSection.js';
import { ItinerarySection } from './ItinerarySection.js';
import { TransitAndCarSection } from './TransitAndCarSection.js';
import { BudgetCalculatorSection } from './BudgetCalculatorSection.js';
import { DestinationMap } from './DestinationMap.js';
import { WeatherWidget } from './WeatherWidget.js';
import { AdvisorySection } from './AdvisorySection.js';

interface TripDetailViewProps {
  destination: IDestinationCard;
  searchQuery: UserSearchQuery;
  currency: string;
  exchangeRate: number;
  initialTab?: 'overview' | 'flights' | 'hotels' | 'itinerary' | 'transit' | 'car' | 'budget' | 'map';
  onBack: () => void;
  onUpdateSearchQuery: (updated: Partial<UserSearchQuery>) => void;
  onOpenLocationModal?: () => void;
}

export const TripDetailView: React.FC<TripDetailViewProps> = ({
  destination,
  searchQuery,
  currency,
  exchangeRate,
  initialTab = 'overview',
  onBack,
  onUpdateSearchQuery,
  onOpenLocationModal
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'flights' | 'hotels' | 'itinerary' | 'transit' | 'car' | 'budget' | 'map'
  >(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [selectedAirline, setSelectedAirline] = useState<AirlineOption | undefined>();
  const [copiedLink, setCopiedLink] = useState(false);

  const start = new Date(searchQuery.departureDate);
  const end = new Date(searchQuery.returnDate);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const totalNights = Math.max(1, totalDays - 1);
  const totalTravellers = searchQuery.adults + searchQuery.children;

  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  const tabs: { id: typeof activeTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Stays', icon: Building2 },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'transit', label: 'Getting Around', icon: Train },
    { id: 'car', label: 'Car Rental', icon: Car },
    { id: 'budget', label: 'Budget Breakdown', icon: DollarSign },
    { id: 'map', label: 'Map & Route', icon: Compass }
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 pb-24 text-neutral-100">
      {/* Top Banner Navigation */}
      <div className="sticky top-16 z-30 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Recommendations</span>
            </button>

            {/* Destination Pill & Trip Summary */}
            <div className="flex items-center gap-2 text-xs font-mono">
              {onOpenLocationModal ? (
                <button
                  type="button"
                  onClick={onOpenLocationModal}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/70 border border-amber-500/40 text-amber-300 hover:bg-amber-900/50 transition-colors font-bold cursor-pointer"
                  title="Click to select another destination"
                >
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span>{destination.name}</span>
                  <span className="text-[10px] text-amber-400/80 font-normal">Switch ▾</span>
                </button>
              ) : (
                <span className="font-bold text-amber-400">{destination.name}</span>
              )}
              <span className="text-neutral-500 hidden sm:inline">·</span>
              <span className="text-neutral-400 hidden sm:inline">{totalDays} Days</span>
              <span className="text-neutral-500 hidden sm:inline">·</span>
              <span className="text-neutral-400 hidden sm:inline">{totalTravellers} pax</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-neutral-800/60">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Summary Block */}
            <div className={`relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br ${destination.gradientTheme} p-6 sm:p-8`}>
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  <span>SIN ⇄ {destination.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{Math.floor(destination.flightDurationMinutes / 60)}h {destination.flightDurationMinutes % 60}m flight</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100">
                  {destination.name}, {destination.country}
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  {destination.suitabilityReason}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-neutral-200">
                  <span className="font-semibold text-neutral-400">Highlights:</span>
                  {destination.topAttractions.map((att, i) => (
                    <span key={i} className="bg-neutral-950/60 border border-neutral-800 px-2.5 py-0.5 rounded">
                      {att}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3 Pillars Quick View: Flights, Stay, Weather */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Flight Summary Card */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-amber-400 font-mono">Airfare</span>
                  <button onClick={() => setActiveTab('flights')} className="text-xs text-neutral-400 hover:text-amber-400">
                    View flights →
                  </button>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Est. Return Airfare</span>
                  <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
                    {formatMoney(destination.currentEstimatedFareSGD)}
                  </div>
                  <div className="text-xs text-amber-300 mt-1">
                    SQ Option: {destination.singaporeAirlinesFareSGD ? formatMoney(destination.singaporeAirlinesFareSGD) : 'Check direct'}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Cheapest: {destination.cheapestAlternativeAirline} ({formatMoney(destination.cheapestFareSGD)})
                  </div>
                </div>
              </div>

              {/* Stays Summary Card */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-amber-400 font-mono">Accommodation</span>
                  <button onClick={() => setActiveTab('hotels')} className="text-xs text-neutral-400 hover:text-amber-400">
                    View stays →
                  </button>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">From per night</span>
                  <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
                    {formatMoney(destination.estimatedHotelCostPerNightSGD[searchQuery.hotelCategory])}
                  </div>
                  <div className="text-xs text-neutral-300 mt-1 capitalize">
                    {searchQuery.hotelCategory} Category Selected
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Est. {totalNights} nights: {formatMoney(destination.estimatedHotelCostPerNightSGD[searchQuery.hotelCategory] * totalNights * Math.ceil(totalTravellers / 2))}
                  </div>
                </div>
              </div>

              {/* Total Budget Card */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-amber-400 font-mono">Trip Budget</span>
                  <button onClick={() => setActiveTab('budget')} className="text-xs text-neutral-400 hover:text-amber-400">
                    Full breakdown →
                  </button>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Estimated Total for {totalTravellers} pax</span>
                  <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                    {formatMoney(
                      destination.currentEstimatedFareSGD * totalTravellers +
                      destination.estimatedHotelCostPerNightSGD[searchQuery.hotelCategory] * totalNights * Math.ceil(totalTravellers / 2) +
                      (destination.estimatedFoodDailySGD + destination.estimatedLocalTransportDailySGD + destination.estimatedActivitiesDailySGD) * totalDays * totalTravellers
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Includes flights, stays, food & transit
                  </div>
                </div>
              </div>
            </div>

            {/* Weather & Travel Advisory Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <WeatherWidget
                destinationId={destination.id}
                destinationName={destination.name}
                targetDate={searchQuery.departureDate}
              />
              <AdvisorySection
                destinationId={destination.id}
                destinationName={destination.name}
              />
            </div>
          </div>
        )}

        {/* FLIGHTS TAB */}
        {activeTab === 'flights' && (
          <FlightDealsSection
            destinationId={destination.id}
            destinationName={destination.name}
            airportCode={destination.code}
            departureDate={searchQuery.departureDate}
            returnDate={searchQuery.returnDate}
            travellers={totalTravellers}
            currency={currency}
            exchangeRate={exchangeRate}
            onSelectAirline={setSelectedAirline}
            onUpdateDates={(newDep, newRet) => onUpdateSearchQuery({ departureDate: newDep, returnDate: newRet })}
          />
        )}

        {/* HOTELS TAB */}
        {activeTab === 'hotels' && (
          <AccommodationsSection
            destinationId={destination.id}
            destinationName={destination.name}
            totalNights={totalNights}
            travellers={totalTravellers}
            currency={currency}
            exchangeRate={exchangeRate}
            selectedTier={searchQuery.hotelCategory}
            onSelectTier={tier => onUpdateSearchQuery({ hotelCategory: tier })}
          />
        )}

        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <ItinerarySection
            destinationId={destination.id}
            destinationName={destination.name}
            startDate={searchQuery.departureDate}
            endDate={searchQuery.returnDate}
            travelStyle={searchQuery.travelStyle}
            travellers={totalTravellers}
            hotelCategory={searchQuery.hotelCategory}
            carRentalRequired={searchQuery.carRentalRequired}
            currency={currency}
            exchangeRate={exchangeRate}
            onUpdateTravelStyle={st => onUpdateSearchQuery({ travelStyle: st })}
          />
        )}

        {/* GETTING AROUND / TRANSIT TAB */}
        {activeTab === 'transit' && (
          <TransitAndCarSection
            destinationId={destination.id}
            destinationName={destination.name}
            totalDays={totalDays}
            carRentalRequired={searchQuery.carRentalRequired}
            currency={currency}
            exchangeRate={exchangeRate}
            onToggleCarRental={req => onUpdateSearchQuery({ carRentalRequired: req })}
          />
        )}

        {/* CAR RENTAL TAB */}
        {activeTab === 'car' && (
          <TransitAndCarSection
            destinationId={destination.id}
            destinationName={destination.name}
            totalDays={totalDays}
            carRentalRequired={searchQuery.carRentalRequired}
            currency={currency}
            exchangeRate={exchangeRate}
            onToggleCarRental={req => onUpdateSearchQuery({ carRentalRequired: req })}
          />
        )}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && (
          <BudgetCalculatorSection
            destinationId={destination.id}
            destinationName={destination.name}
            totalDays={totalDays}
            travellers={totalTravellers}
            hotelCategory={searchQuery.hotelCategory}
            carRentalRequired={searchQuery.carRentalRequired}
            currency={currency}
            exchangeRate={exchangeRate}
          />
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <DestinationMap
            destinationName={destination.name}
            airportCode={destination.code}
            topAttractions={destination.topAttractions}
          />
        )}
      </div>
    </div>
  );
};
