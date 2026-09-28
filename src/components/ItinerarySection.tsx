import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Footprints, Train, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { CompleteItinerary, TravelStyle, ItineraryDay } from '../types/travel.js';

interface ItinerarySectionProps {
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelStyle: TravelStyle;
  travellers: number;
  hotelCategory: string;
  carRentalRequired: boolean;
  currency: string;
  exchangeRate: number;
  onUpdateTravelStyle: (style: TravelStyle) => void;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  destinationId,
  destinationName,
  startDate,
  endDate,
  travelStyle,
  travellers,
  hotelCategory,
  carRentalRequired,
  currency,
  exchangeRate,
  onUpdateTravelStyle
}) => {
  const [itinerary, setItinerary] = useState<CompleteItinerary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);

  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  const styles: { id: TravelStyle; label: string; desc: string }[] = [
    { id: 'relaxed', label: 'Relaxed', desc: 'Fewer activities, spacious leisure & rest' },
    { id: 'balanced', label: 'Balanced', desc: 'Equal mix of core sights & downtime' },
    { id: 'packed', label: 'Packed', desc: 'High-density exploration & attractions' },
    { id: 'budget', label: 'Budget', desc: 'Free walks, cultural parks & street food' },
    { id: 'premium', label: 'Premium', desc: 'Fine dining, skyline view bars & bespoke sights' }
  ];

  async function fetchItinerary(styleToUse: TravelStyle) {
    setLoading(true);
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId,
          startDate,
          endDate,
          travelStyle: styleToUse,
          travellers,
          hotelCategory,
          carRentalRequired
        })
      });
      const data = await res.json();
      if (data.success && data.itinerary) {
        setItinerary(data.itinerary);
        setSelectedDayNumber(1);
      }
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItinerary(travelStyle);
  }, [destinationId, startDate, endDate, travelStyle, carRentalRequired]);

  const activeDay = itinerary?.days.find(d => d.dayNumber === selectedDayNumber) || itinerary?.days[0];

  return (
    <div className="space-y-6">
      {/* Header and Style Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <span>Dynamic Schedule Engine</span>
            <span aria-hidden="true">·</span>
            <span>{itinerary?.generatedBy || 'Gemini AI'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
            {itinerary?.totalDays || 5}-Day Custom Itinerary: {destinationName}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            {itinerary?.overview || 'Intelligently paced to avoid travel fatigue, matching local transit lines and airport flight timings.'}
          </p>
        </div>

        {/* Travel Style Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
          {styles.map(st => (
            <button
              key={st.id}
              onClick={() => onUpdateTravelStyle(st.id)}
              disabled={loading}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                travelStyle === st.id
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span className="text-sm text-neutral-400">
            Generating realistic {travelStyle} day-by-day plan for {destinationName}...
          </span>
        </div>
      ) : itinerary && itinerary.days.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Day Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
              Trip Timeline
            </span>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {itinerary.days.map(day => {
                const isSelected = selectedDayNumber === day.dayNumber;
                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDayNumber(day.dayNumber)}
                    className={`w-full text-left p-3 rounded-lg border transition-all shrink-0 ${
                      isSelected
                        ? 'border-amber-500/80 bg-neutral-900 shadow-sm text-neutral-100'
                        : 'border-neutral-800/80 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold font-mono ${isSelected ? 'text-amber-400' : 'text-neutral-400'}`}>
                        DAY {day.dayNumber}
                      </span>
                      <span className="text-[11px] text-neutral-500">{day.dateStr}</span>
                    </div>
                    <div className="text-xs font-medium text-neutral-200 mt-1 truncate">
                      {day.theme}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Activities Schedule */}
          <div className="lg:col-span-3 space-y-4">
            {activeDay && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-6">
                {/* Day Header */}
                <div className="border-b border-neutral-800/80 pb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                    <span>DAY {activeDay.dayNumber} OF {itinerary.totalDays}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeDay.dateStr}</span>
                  </div>
                  <h4 className="text-xl font-bold text-neutral-100">
                    {activeDay.theme}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {activeDay.summary}
                  </p>
                </div>

                {/* Day Activities List */}
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:bg-neutral-800">
                  {activeDay.activities.map((act, idx) => (
                    <div key={idx} className="relative pl-9 space-y-2">
                      {/* Timeline dot */}
                      <div className="absolute left-2 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-neutral-950 bg-amber-400" />

                      {/* Transit instruction step between activities if present */}
                      {act.transitFromPrevious && (
                        <div className="mb-2 rounded-lg bg-neutral-950/80 p-2 text-xs border border-neutral-800/60 flex items-center justify-between text-neutral-300 font-mono">
                          <div className="flex items-center gap-2">
                            <Train className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span>{act.transitFromPrevious.mode} · {act.transitFromPrevious.durationMinutes} min</span>
                          </div>
                          <div className="text-neutral-400 text-[11px]">
                            {act.transitFromPrevious.instructions} ({formatMoney(act.transitFromPrevious.fareSGD)})
                          </div>
                        </div>
                      )}

                      {/* Activity Card */}
                      <div className="rounded-lg border border-neutral-800 bg-neutral-950/90 p-4 transition-colors hover:border-neutral-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-neutral-900 text-amber-300 border border-neutral-800">
                              {act.timeSlot}
                            </span>
                            <span className="text-xs text-neutral-400 font-mono">
                              {act.timeEstimate}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium">
                              · {act.category}
                            </span>
                          </div>

                          {act.costSGD > 0 && (
                            <span className="text-xs font-mono font-semibold text-neutral-300 tabular-nums">
                              Est. {formatMoney(act.costSGD)}
                            </span>
                          )}
                        </div>

                        <div className="mt-2">
                          <h5 className="text-base font-bold text-neutral-100">
                            {act.title}
                          </h5>
                          <div className="flex items-center gap-1.5 text-xs text-amber-400/90 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            <span>{act.location}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                            {act.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
