import React from 'react';
import { Plane, Clock, CloudSun, Check, ChevronRight, Sparkles } from 'lucide-react';
import { DestinationCard as IDestinationCard } from '../types/travel.js';

interface DestinationCardProps {
  destination: IDestinationCard & { calculatedBudget?: any };
  currency: string;
  exchangeRate: number;
  onSelect: (destId: string) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (destId: string) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  currency,
  exchangeRate,
  onSelect,
  isSelectedForCompare,
  onToggleCompare
}) => {
  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  const hours = Math.floor(destination.flightDurationMinutes / 60);
  const minutes = destination.flightDurationMinutes % 60;
  const durationText = `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/90 transition-all duration-200 hover:border-neutral-700 hover:shadow-xl">
      {/* Visual Header / Landmark Banner */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${destination.gradientTheme} p-4 flex flex-col justify-between overflow-hidden border-b border-neutral-800/80`}>
        {/* Subtle patterned grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

        {/* Top bar on card */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 bg-neutral-950/70 backdrop-blur-xs px-2.5 py-1 rounded-md border border-neutral-800">
            <span className="font-bold text-amber-400">{destination.code}</span>
            <span aria-hidden="true">·</span>
            <span>SIN → {destination.code}</span>
          </div>

          {/* Compare Checkbox */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggleCompare(destination.id);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
              isSelectedForCompare
                ? 'bg-amber-400 text-neutral-950 border-amber-300 font-semibold'
                : 'bg-neutral-950/70 backdrop-blur-xs text-neutral-300 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className={`h-3 w-3 rounded-xs border flex items-center justify-center ${isSelectedForCompare ? 'border-neutral-950 bg-neutral-950 text-amber-400' : 'border-neutral-500'}`}>
              {isSelectedForCompare && <Check className="h-2.5 w-2.5" />}
            </div>
            <span>Compare</span>
          </button>
        </div>

        {/* Landmark & Title lockup */}
        <div className="relative z-10">
          <div className="text-xs font-medium text-amber-300 tracking-wide uppercase">
            {destination.country}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-neutral-100">
            {destination.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-neutral-300 mt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-neutral-400" />
              <span>{durationText} flight</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{destination.directFlightAvailable ? 'Direct flight available' : 'Connecting'}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4">
        {/* Deal Tag & Airfare Breakdown */}
        <div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-neutral-400 block">Est. Return Airfare</span>
              <div className="text-xl font-bold text-neutral-100 font-mono tabular-nums">
                {formatMoney(destination.currentEstimatedFareSGD)}
              </div>
            </div>

            {/* Deal Difference Badge */}
            {destination.dealTag && (
              <div className="text-right">
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                  destination.dealTag === 'Below Typical Range'
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                    : 'text-neutral-400 bg-neutral-800'
                }`}>
                  {destination.dealTag}
                  {destination.dealDiffPercent ? ` (${destination.dealDiffPercent > 0 ? '+' : ''}${destination.dealDiffPercent.toFixed(1)}%)` : ''}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  Typical: SGD {destination.historicalFareRangeSGD.min}-{destination.historicalFareRangeSGD.max}
                </span>
              </div>
            )}
          </div>

          {/* Singapore Airlines Fare Callout */}
          <div className="mt-3 rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-amber-300">
                <Plane className="h-3 w-3" />
                <span>Singapore Airlines</span>
              </div>
              <span className="font-mono font-semibold text-neutral-200 tabular-nums">
                {destination.singaporeAirlinesFareSGD
                  ? formatMoney(destination.singaporeAirlinesFareSGD)
                  : 'Check SQ direct'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
              <span>Cheapest Alternative:</span>
              <span className="text-neutral-300 font-mono">{destination.cheapestAlternativeAirline} ({formatMoney(destination.cheapestFareSGD)})</span>
            </div>
          </div>
        </div>

        {/* Why this destination suits dates & season */}
        <div className="text-xs text-neutral-400 border-t border-neutral-800/80 pt-3">
          <div className="flex items-center gap-1.5 text-neutral-300 font-medium mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Why it suits your dates:</span>
          </div>
          <p className="line-clamp-2 text-neutral-400 leading-relaxed">
            {destination.suitabilityReason}
          </p>
        </div>

        {/* Key Indicators Strip: Hotel, Transit, Estimated Total */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-neutral-800/80 pt-3">
          <div>
            <span className="text-neutral-500 block">Stays from</span>
            <span className="font-mono font-medium text-neutral-300 tabular-nums">
              {formatMoney(destination.estimatedHotelCostPerNightSGD.mid)} / night
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block">Estimated Total</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {destination.calculatedBudget
                ? formatMoney(destination.calculatedBudget.totalTripSGD)
                : formatMoney(destination.currentEstimatedFareSGD + destination.estimatedHotelCostPerNightSGD.mid * 4)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelect(destination.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-neutral-200 hover:bg-white rounded-lg transition-colors group-hover:bg-amber-400"
          >
            <span>View Full Trip & Flights</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
