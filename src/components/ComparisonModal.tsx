import React from 'react';
import { X, Check, AlertCircle, Plane, Train, Car, Calendar, ExternalLink } from 'lucide-react';
import { DestinationCard } from '../types/travel.js';

interface ComparisonModalProps {
  destinations: DestinationCard[];
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  exchangeRate: number;
  onSelectDestination: (destId: string) => void;
  onRemoveDestination: (destId: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  destinations,
  isOpen,
  onClose,
  currency,
  exchangeRate,
  onSelectDestination,
  onRemoveDestination
}) => {
  if (!isOpen || destinations.length === 0) return null;

  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>Transparent Comparison</span>
              <span aria-hidden="true">·</span>
              <span>Departing Singapore Changi (SIN)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
              Destination Comparison Matrix ({destinations.length}/4)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300 border-collapse">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="py-3 px-4 font-semibold text-neutral-400 bg-neutral-900/50 w-44">
                  Metric / Factor
                </th>
                {destinations.map(d => (
                  <th key={d.id} className="py-3 px-4 font-bold text-neutral-100 min-w-64">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-amber-400 font-mono">{d.code} · {d.country}</div>
                        <div className="text-base text-neutral-100">{d.name}</div>
                      </div>
                      <button
                        onClick={() => onRemoveDestination(d.id)}
                        className="text-neutral-500 hover:text-red-400 text-xs p-1"
                        title="Remove from comparison"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {/* Return Flight */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Est. Return Airfare
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4">
                    <div className="font-bold text-neutral-100 font-mono tabular-nums">
                      {formatMoney(d.currentEstimatedFareSGD)}
                    </div>
                    <div className="text-xs text-amber-400/90 mt-0.5">
                      SQ: {d.singaporeAirlinesFareSGD ? formatMoney(d.singaporeAirlinesFareSGD) : 'Check direct'}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Cheapest: {d.cheapestAlternativeAirline} ({formatMoney(d.cheapestFareSGD)})
                    </div>
                  </td>
                ))}
              </tr>

              {/* Flight Duration */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Flight Duration
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4">
                    <span className="font-mono text-neutral-200">
                      {Math.floor(d.flightDurationMinutes / 60)}h {d.flightDurationMinutes % 60}m
                    </span>
                    <span className="text-xs text-neutral-400 block">
                      {d.directFlightAvailable ? 'Direct flight from SIN' : 'Connecting flight'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Deal Status */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Deal Analysis
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                      d.dealTag === 'Below Typical Range'
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                        : 'text-neutral-400 bg-neutral-800'
                    }`}>
                      {d.dealTag}
                      {d.dealDiffPercent ? ` (${d.dealDiffPercent > 0 ? '+' : ''}${d.dealDiffPercent.toFixed(1)}%)` : ''}
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-1">
                      Historical: SGD {d.historicalFareRangeSGD.min}-{d.historicalFareRangeSGD.max}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Hotel per Night */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Hotel (Mid-Range)
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4 font-mono tabular-nums text-neutral-200">
                    {formatMoney(d.estimatedHotelCostPerNightSGD.mid)} / night
                    <span className="text-xs text-neutral-500 block font-sans">
                      Budget: {formatMoney(d.estimatedHotelCostPerNightSGD.budget)} · Luxury: {formatMoney(d.estimatedHotelCostPerNightSGD.premium)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Local Transport Daily */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Daily Local Transport
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4 font-mono tabular-nums text-neutral-200">
                    {formatMoney(d.estimatedLocalTransportDailySGD)} / person / day
                  </td>
                ))}
              </tr>

              {/* Food & Activities Daily */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Daily Food & Activities
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4 font-mono tabular-nums text-neutral-200">
                    {formatMoney(d.estimatedFoodDailySGD + d.estimatedActivitiesDailySGD)} / person / day
                    <span className="text-xs text-neutral-500 block font-sans">
                      Food: {formatMoney(d.estimatedFoodDailySGD)} · Activities: {formatMoney(d.estimatedActivitiesDailySGD)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Public Transport Quality */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Public Transit Quality
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4">
                    <span className="font-semibold text-neutral-200">{d.publicTransportRating}</span>
                  </td>
                ))}
              </tr>

              {/* Car Rental Usefulness */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Car Rental Usefulness
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      d.carRentalUsefulness === 'Not Needed'
                        ? 'bg-neutral-800 text-neutral-300'
                        : d.carRentalUsefulness === 'Recommended'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {d.carRentalUsefulness}
                    </span>
                    <span className="text-xs text-neutral-500 block mt-1 font-mono">
                      ~{formatMoney(d.estimatedCarRentalDailySGD)} / day
                    </span>
                  </td>
                ))}
              </tr>

              {/* Climate & Season */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Climate & Season
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4 text-xs text-neutral-300">
                    <div className="font-medium capitalize text-amber-300">{d.climate} Climate</div>
                    <div className="text-neutral-400 mt-0.5 line-clamp-2">{d.typicalSeason}</div>
                  </td>
                ))}
              </tr>

              {/* Top Attractions */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Top Attractions
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4 text-xs text-neutral-300">
                    <ul className="list-disc list-inside space-y-0.5">
                      {d.topAttractions.slice(0, 3).map((att, i) => (
                        <li key={i} className="truncate">{att}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Suggested Days */}
              <tr>
                <td className="py-3 px-4 font-medium text-neutral-400 bg-neutral-900/30">
                  Recommended Duration
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-3 px-4 font-semibold text-neutral-200">
                    {d.suggestedDays} Days
                  </td>
                ))}
              </tr>

              {/* Selection Actions */}
              <tr className="bg-neutral-900/60">
                <td className="py-4 px-4 font-medium text-neutral-400">
                  Action
                </td>
                {destinations.map(d => (
                  <td key={d.id} className="py-4 px-4">
                    <button
                      onClick={() => {
                        onSelectDestination(d.id);
                        onClose();
                      }}
                      className="w-full py-2 px-3 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Select {d.name}</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
