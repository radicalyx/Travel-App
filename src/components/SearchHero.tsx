import React, { useState } from 'react';
import { Plane, Calendar, Users, DollarSign, SlidersHorizontal, Search, Sparkles, Check } from 'lucide-react';
import { UserSearchQuery, TravelStyle, ActivityTag } from '../types/travel.js';

interface SearchHeroProps {
  searchQuery: UserSearchQuery;
  onSearch: (newQuery: UserSearchQuery) => void;
  isLoading: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  searchQuery,
  onSearch,
  isLoading
}) => {
  const [form, setForm] = useState<UserSearchQuery>(searchQuery);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const travelStyles: { id: TravelStyle; label: string; desc: string }[] = [
    { id: 'relaxed', label: 'Relaxed', desc: 'Slow pace, ample leisure' },
    { id: 'balanced', label: 'Balanced', desc: 'Ideal mix of highlights & downtime' },
    { id: 'packed', label: 'Packed', desc: 'Maximum attractions & sights' },
    { id: 'budget', label: 'Budget', desc: 'Free walks, value dining' },
    { id: 'premium', label: 'Premium', desc: 'Curated luxury & fine dining' }
  ];

  const availableTags: { id: ActivityTag; label: string }[] = [
    { id: 'food', label: 'Food & Dining' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'culture', label: 'Culture & Heritage' },
    { id: 'city', label: 'City Explorer' },
    { id: 'beach', label: 'Beach & Coastal' },
    { id: 'nature', label: 'Nature & Parks' },
    { id: 'family', label: 'Family Friendly' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'luxury', label: 'Luxury' }
  ];

  const toggleTag = (tag: ActivityTag) => {
    const exists = form.activities.includes(tag);
    const updated = exists
      ? form.activities.filter(t => t !== tag)
      : [...form.activities, tag];
    setForm({ ...form, activities: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <div className="relative border-b border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Editorial Title & Kicker */}
        <div className="mb-6 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wide uppercase mb-2">
            <span>Singapore Changi Hub</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Route & Airfare Discovery</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl lg:text-5xl text-balance">
            Where can we take you?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl">
            You don't need to pick a destination first. Enter your travel dates and preferences — we discover the best flight deals, live airline routes, and tailored itineraries from Singapore.
          </p>
        </div>

        {/* Primary Search Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Origin Airport (Default Singapore SIN) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <Plane className="h-3.5 w-3.5 text-amber-400" />
                <span>FROM</span>
              </label>
              <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200">
                <span className="font-semibold text-amber-400 mr-2">SIN</span>
                <span className="text-neutral-300 truncate">Singapore (Changi)</span>
              </div>
            </div>

            {/* Travel Dates: Departure */}
            <div className="space-y-1.5">
              <label htmlFor="dep-date" className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>DEPARTURE</span>
              </label>
              <input
                id="dep-date"
                type="date"
                value={form.departureDate}
                onChange={e => setForm({ ...form, departureDate: e.target.value })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Travel Dates: Return */}
            <div className="space-y-1.5">
              <label htmlFor="ret-date" className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>RETURN</span>
              </label>
              <input
                id="ret-date"
                type="date"
                value={form.returnDate}
                onChange={e => setForm({ ...form, returnDate: e.target.value })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Travellers */}
            <div className="space-y-1.5">
              <label htmlFor="travellers-select" className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-amber-400" />
                <span>TRAVELLERS</span>
              </label>
              <select
                id="travellers-select"
                value={`${form.adults}_${form.children}`}
                onChange={e => {
                  const [a, c] = e.target.value.split('_').map(Number);
                  setForm({ ...form, adults: a, children: c });
                }}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="1_0">1 Adult (Solo)</option>
                <option value="2_0">2 Adults (Couple/Pair)</option>
                <option value="2_1">2 Adults, 1 Child</option>
                <option value="2_2">2 Adults, 2 Children</option>
                <option value="4_0">4 Adults (Group)</option>
              </select>
            </div>

            {/* Approximate Total Trip Budget (Optional - Budget First) */}
            <div className="space-y-1.5">
              <label htmlFor="budget-input" className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                <span>MAX BUDGET (SGD)</span>
              </label>
              <div className="relative">
                <input
                  id="budget-input"
                  type="number"
                  placeholder="e.g. 4000 (Optional)"
                  value={form.budget || ''}
                  onChange={e => setForm({ ...form, budget: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:border-amber-500 focus:outline-none font-mono tabular-nums"
                  step="250"
                  min="500"
                />
              </div>
            </div>
          </div>

          {/* Secondary Controls Bar */}
          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-neutral-400 mr-1">Style:</span>
              <div className="flex items-center gap-1 p-0.5 bg-neutral-950 border border-neutral-800 rounded-lg">
                {travelStyles.map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setForm({ ...form, travelStyle: st.id })}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      form.travelStyle === st.id
                        ? 'bg-amber-500 text-neutral-950 font-semibold shadow-xs'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Direct Flights Only Toggle */}
              <button
                type="button"
                onClick={() => setForm({ ...form, directOnly: !form.directOnly })}
                className={`ml-2 flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                  form.directOnly
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className={`h-3 w-3 rounded-xs border flex items-center justify-center ${form.directOnly ? 'border-amber-400 bg-amber-400' : 'border-neutral-600'}`}>
                  {form.directOnly && <Check className="h-2.5 w-2.5 text-neutral-950" />}
                </div>
                <span>Direct Flights Only</span>
              </button>

              {/* Car Rental Required Toggle */}
              <button
                type="button"
                onClick={() => setForm({ ...form, carRentalRequired: !form.carRentalRequired })}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                  form.carRentalRequired
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className={`h-3 w-3 rounded-xs border flex items-center justify-center ${form.carRentalRequired ? 'border-amber-400 bg-amber-400' : 'border-neutral-600'}`}>
                  {form.carRentalRequired && <Check className="h-2.5 w-2.5 text-neutral-950" />}
                </div>
                <span>Car Rental Required</span>
              </button>

              {/* Toggle More Preferences */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-200"
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>{showAdvanced ? 'Fewer Filters' : 'More Preferences'}</span>
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>FIND MY TRIP</span>
            </button>
          </div>

          {/* Expanded Preferences Panel */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cabin Class */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-neutral-400">Cabin Class</span>
                <select
                  value={form.cabinClass}
                  onChange={e => setForm({ ...form, cabinClass: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                >
                  <option value="economy">Economy Class</option>
                  <option value="premium_economy">Premium Economy</option>
                  <option value="business">Business Class</option>
                </select>
              </div>

              {/* Climate Preference */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-neutral-400">Preferred Climate</span>
                <select
                  value={form.preferredClimate || 'any'}
                  onChange={e => setForm({ ...form, preferredClimate: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                >
                  <option value="any">Any Climate</option>
                  <option value="tropical">Warm / Tropical</option>
                  <option value="mild">Mild & Crisp</option>
                  <option value="cold">Cool / Winter</option>
                </select>
              </div>

              {/* Hotel Tier */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-neutral-400">Stay Category</span>
                <select
                  value={form.hotelCategory}
                  onChange={e => setForm({ ...form, hotelCategory: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                >
                  <option value="mid">Mid-Range (Quality 3-4★)</option>
                  <option value="budget">Budget-Friendly (Hostels / Clean 3★)</option>
                  <option value="premium">Luxury & 5★ Resorts</option>
                </select>
              </div>

              {/* Activities Filter Tags */}
              <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                <span className="text-xs font-medium text-neutral-400">Preferred Interests:</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map(tag => {
                    const isSelected = form.activities.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                            : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
