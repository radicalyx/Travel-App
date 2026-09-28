import React, { useState, useEffect } from 'react';
import { Plane, Clock, ShieldCheck, ArrowRight, Calendar, Sparkles, TrendingDown, Info, ExternalLink } from 'lucide-react';
import { AirlineOption, FlexibleDateOption } from '../types/travel.js';

interface FlightDealsSectionProps {
  destinationId: string;
  destinationName: string;
  airportCode: string;
  departureDate: string;
  returnDate: string;
  travellers: number;
  currency: string;
  exchangeRate: number;
  onSelectAirline?: (airline: AirlineOption) => void;
  onUpdateDates?: (newDep: string, newRet: string) => void;
}

export const FlightDealsSection: React.FC<FlightDealsSectionProps> = ({
  destinationId,
  destinationName,
  airportCode,
  departureDate,
  returnDate,
  travellers,
  currency,
  exchangeRate,
  onSelectAirline,
  onUpdateDates
}) => {
  const [flights, setFlights] = useState<AirlineOption[]>([]);
  const [flexibleOptions, setFlexibleOptions] = useState<FlexibleDateOption[]>([]);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState<number>(0);
  const [activeFlexTab, setActiveFlexTab] = useState<'3' | '1' | '7'>('3');
  const [loading, setLoading] = useState<boolean>(true);
  const [dealData, setDealData] = useState<any>(null);

  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  useEffect(() => {
    async function loadFlightData() {
      setLoading(true);
      try {
        const [flightsRes, flexRes] = await Promise.all([
          fetch(`/api/flights?destinationId=${destinationId}&departureDate=${departureDate}&returnDate=${returnDate}`),
          fetch(`/api/flights/flexible?destinationId=${destinationId}&departureDate=${departureDate}&returnDate=${returnDate}`)
        ]);

        const fData = await flightsRes.json();
        const flexData = await flexRes.json();

        if (fData.success) {
          setFlights(fData.flights || []);
          setDealData(fData);
        }
        if (flexData.success) {
          setFlexibleOptions(flexData.flexibleOptions || []);
        }
      } catch (err) {
        console.error('Failed to load flight data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFlightData();
  }, [destinationId, departureDate, returnDate]);

  return (
    <div className="space-y-8">
      {/* Route Header Banner */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>Changi Flight Matrix</span>
              <span aria-hidden="true">·</span>
              <span>SIN ⇄ {airportCode}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
              Flights from Singapore to {destinationName}
            </h2>
            <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
              <span>{departureDate} to {returnDate}</span>
              <span aria-hidden="true">·</span>
              <span>{travellers} {travellers === 1 ? 'traveller' : 'travellers'}</span>
              <span aria-hidden="true">·</span>
              <span>Economy Class</span>
            </div>
          </div>

          {/* Deal analysis callout */}
          {dealData && dealData.dealTag && (
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 sm:text-right">
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                dealData.dealTag === 'Below Typical Range'
                  ? 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/60'
                  : 'text-neutral-300 bg-neutral-800'
              }`}>
                {dealData.dealTag}
              </span>
              <div className="text-xs text-neutral-400 mt-1">
                Ref. typical: <span className="font-mono text-neutral-300">SGD {dealData.historicalReference.min} – {dealData.historicalReference.max}</span>
              </div>
              <div className="text-[11px] text-neutral-500">
                Transparent yield benchmark calculation
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flexible Date Search Engine (±1, ±3, ±7 days) */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            <h3 className="text-base font-semibold text-neutral-100">
              Flexible Date Opportunities
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-neutral-400 mr-1 hidden sm:inline">Compare window:</span>
            {(['1', '3', '7'] as const).map(w => (
              <button
                key={w}
                onClick={() => setActiveFlexTab(w)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  activeFlexTab === w
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                ±{w} {Number(w) === 1 ? 'day' : 'days'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-neutral-400 mb-4">
          Comparing flight schedules departing Changi across mid-week and alternate weekend combinations. Shifting travel dates can materially reduce total airfare:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {flexibleOptions.map((opt, idx) => {
            const hasSavings = opt.savingsSGD > 0;
            return (
              <div
                key={idx}
                className={`rounded-lg border p-3.5 flex flex-col justify-between transition-colors ${
                  hasSavings
                    ? 'border-emerald-800/40 bg-emerald-950/20'
                    : 'border-neutral-800 bg-neutral-950/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-400 font-mono">
                      {opt.daysDiff > 0 ? `+${opt.daysDiff}` : opt.daysDiff} days shift
                    </span>
                    {hasSavings ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <TrendingDown className="h-3 w-3" />
                        Save {formatMoney(opt.savingsSGD)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-500">Same range</span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-neutral-200">
                    {opt.departureDate} → {opt.returnDate}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {opt.airline} · {opt.isDirect ? 'Direct' : '1 stop'}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                  <span className="text-sm font-bold font-mono text-neutral-100 tabular-nums">
                    {formatMoney(opt.fareSGD)}
                  </span>
                  {onUpdateDates && (
                    <button
                      onClick={() => onUpdateDates(opt.departureDate, opt.returnDate)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>Apply</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flight Options List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-100">
            Available Airline Options ({flights.length})
          </h3>
          <span className="text-xs text-neutral-500">
            Fares shown are return per traveller including mandatory taxes & surcharges
          </span>
        </div>

        {flights.map((flight, idx) => {
          const isSelected = selectedFlightIndex === idx;
          const isSQ = flight.isSingaporeAirlines;

          return (
            <div
              key={flight.flightNumber + idx}
              onClick={() => {
                setSelectedFlightIndex(idx);
                onSelectAirline?.(flight);
              }}
              className={`cursor-pointer rounded-xl border p-4 sm:p-5 transition-all ${
                isSelected
                  ? 'border-amber-500/80 bg-neutral-900/90 shadow-md ring-1 ring-amber-500/30'
                  : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Airline & Timing column */}
                <div className="flex-1 space-y-3">
                  {/* Tags row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-neutral-100">
                      {flight.airline}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      ({flight.flightNumber})
                    </span>

                    {/* Prominent badge for Singapore Airlines */}
                    {isSQ && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        <span>Singapore Airlines Option</span>
                      </span>
                    )}

                    {/* Calculated tags */}
                    {flight.classification && flight.classification !== 'Singapore Airlines' && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        flight.classification === 'Lowest Fare'
                          ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                          : flight.classification === 'Best Value'
                          ? 'bg-blue-950/70 text-blue-300 border border-blue-800/60'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {flight.classification}
                      </span>
                    )}

                    {flight.dealTag && (
                      <span className="text-[11px] text-neutral-400">
                        {flight.dealTag}
                      </span>
                    )}
                  </div>

                  {/* Flight Schedule Row */}
                  <div className="grid grid-cols-3 items-center max-w-md text-neutral-200">
                    <div>
                      <div className="text-lg font-bold font-mono tabular-nums">{flight.departureTime}</div>
                      <div className="text-xs text-neutral-400">SIN (Changi)</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-xs text-neutral-400 mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m</span>
                      </div>
                      <div className="relative w-full flex items-center">
                        <div className="h-px w-full bg-neutral-700" />
                        <Plane className="h-3.5 w-3.5 text-neutral-400 absolute left-1/2 -translate-x-1/2 rotate-90" />
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        {flight.isDirect ? 'Direct' : `${flight.stops} Stop (${flight.stopoverAirport})`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold font-mono tabular-nums">{flight.arrivalTime}</div>
                      <div className="text-xs text-neutral-400">{airportCode}</div>
                    </div>
                  </div>

                  {/* Baggage & Inclusions */}
                  <div className="text-xs text-neutral-400 flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-neutral-500" />
                    <span>{flight.baggageAllowance}</span>
                  </div>
                </div>

                {/* Pricing & Selection Column */}
                <div className="lg:border-l lg:border-neutral-800/80 lg:pl-6 flex flex-col justify-between items-start lg:items-end min-w-56">
                  <div>
                    <span className="text-xs text-neutral-500 block lg:text-right">Return Fare per person</span>
                    <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums lg:text-right">
                      {formatMoney(flight.totalFareSGD)}
                    </div>
                    <div className="text-[11px] text-neutral-400 lg:text-right font-mono">
                      Base: {formatMoney(flight.baseFareSGD)} + Taxes: {formatMoney(flight.taxesSGD)}
                    </div>
                    {travellers > 1 && (
                      <div className="text-xs text-amber-400/90 font-medium font-mono lg:text-right mt-1">
                        Total for {travellers}: {formatMoney(flight.totalFareSGD * travellers)}
                      </div>
                    )}
                  </div>

                  {/* Selection Button */}
                  <div className="mt-4 w-full lg:w-auto">
                    {isSQ ? (
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          className={`w-full lg:w-auto px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-amber-400 text-neutral-950 font-bold'
                              : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                          }`}
                        >
                          {isSelected ? '✓ Selected SQ Flight' : 'Select Flight'}
                        </button>
                        <a
                          href="https://www.singaporeair.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-[11px] text-amber-400/80 hover:text-amber-300 flex items-center gap-1 justify-end"
                        >
                          <span>Check current fare with Singapore Airlines</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={`w-full lg:w-auto px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                        }`}
                      >
                        {isSelected ? '✓ Selected Flight' : 'Select Flight'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Transparency Footer */}
              <div className="mt-3 pt-2.5 border-t border-neutral-800/40 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>Source: {flight.dataSource}</span>
                <span>Verified: {new Date(flight.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
