import React, { useState, useEffect } from 'react';
import { Building2, Star, MapPin, Train, ExternalLink, Check, Sparkles } from 'lucide-react';
import { AccommodationOption } from '../types/travel.js';

interface AccommodationsSectionProps {
  destinationId: string;
  destinationName: string;
  totalNights: number;
  travellers: number;
  currency: string;
  exchangeRate: number;
  selectedTier: 'budget' | 'mid' | 'premium';
  onSelectTier: (tier: 'budget' | 'mid' | 'premium') => void;
}

export const AccommodationsSection: React.FC<AccommodationsSectionProps> = ({
  destinationId,
  destinationName,
  totalNights,
  travellers,
  currency,
  exchangeRate,
  selectedTier,
  onSelectTier
}) => {
  const [accommodations, setAccommodations] = useState<AccommodationOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const roomsNeeded = Math.ceil(travellers / 2);

  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  useEffect(() => {
    async function loadHotels() {
      setLoading(true);
      try {
        const res = await fetch(`/api/hotels?destinationId=${destinationId}`);
        const data = await res.json();
        if (data.success) {
          setAccommodations(data.accommodations || []);
        }
      } catch (err) {
        console.error('Failed to load hotels:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHotels();
  }, [destinationId]);

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-100">
            Curated Stays in {destinationName}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Based on {totalNights} nights, {roomsNeeded} room{roomsNeeded > 1 ? 's' : ''} for {travellers} travellers. Verified distance to metro lines.
          </p>
        </div>

        {/* Tier Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
          {(['budget', 'mid', 'premium'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => onSelectTier(tier)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                selectedTier === tier
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tier === 'mid' ? 'Mid-Range (Recommended)' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accommodations.map(stay => {
          const isSelected = selectedTier === stay.tier;
          const totalStay = stay.nightlyPriceSGD * totalNights * roomsNeeded;

          return (
            <div
              key={stay.id}
              onClick={() => onSelectTier(stay.tier)}
              className={`cursor-pointer rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-amber-500/80 bg-neutral-900/90 shadow-lg ring-1 ring-amber-500/30'
                  : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
              }`}
            >
              <div className="space-y-3">
                {/* Tier and Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                      {stay.tier}
                    </span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="text-xs text-neutral-400">{stay.type}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span>{stay.rating}</span>
                    <span className="text-[11px] text-neutral-400 font-normal">({stay.reviewsCount})</span>
                  </div>
                </div>

                {/* Hotel Name */}
                <h4 className="text-lg font-bold text-neutral-100">
                  {stay.name}
                </h4>

                {/* Neighborhood & Transit */}
                <div className="space-y-1.5 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="font-medium">{stay.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Train className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                    <span>{stay.distanceToTransit}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {stay.distanceToAttractions}
                  </div>
                </div>

                {/* Convenience Reason */}
                <div className="rounded-lg bg-neutral-950/70 p-2.5 text-xs text-neutral-300 border border-neutral-800/80">
                  <div className="font-medium text-amber-300 text-[11px] mb-0.5">Location Advantage:</div>
                  <p className="line-clamp-2 leading-relaxed text-neutral-400">
                    {stay.convenienceReason}
                  </p>
                </div>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {stay.amenities.slice(0, 4).map((am, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & Selection Footer */}
              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-end justify-between">
                <div>
                  <span className="text-xs text-neutral-500 block">From</span>
                  <div className="text-xl font-bold font-mono text-neutral-100 tabular-nums">
                    {formatMoney(stay.nightlyPriceSGD)}
                    <span className="text-xs font-normal text-neutral-400"> / night</span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-400/90 mt-0.5">
                    Est. total: {formatMoney(totalStay)} ({totalNights}n)
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <button
                    type="button"
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    <span>{isSelected ? 'Applied to Trip' : 'Select'}</span>
                  </button>
                  <a
                    href={stay.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-[11px] text-neutral-500 hover:text-neutral-300 flex items-center gap-0.5"
                  >
                    <span>Partner details</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
