import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, Edit3, Sliders, CheckCircle, PieChart, Users, Calendar } from 'lucide-react';
import { TripBudgetBreakdown } from '../types/travel.js';

interface BudgetCalculatorSectionProps {
  destinationId: string;
  destinationName: string;
  totalDays: number;
  travellers: number;
  hotelCategory: 'budget' | 'mid' | 'premium';
  carRentalRequired: boolean;
  currency: string;
  exchangeRate: number;
  initialAirlineIndex?: number;
}

export const BudgetCalculatorSection: React.FC<BudgetCalculatorSectionProps> = ({
  destinationId,
  destinationName,
  totalDays,
  travellers,
  hotelCategory,
  carRentalRequired,
  currency,
  exchangeRate,
  initialAirlineIndex = 0
}) => {
  const [budgetData, setBudgetData] = useState<TripBudgetBreakdown | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // User-editable assumption overrides
  const [customFoodDailySGD, setCustomFoodDailySGD] = useState<number | null>(null);
  const [customAttractionsSGD, setCustomAttractionsSGD] = useState<number | null>(null);

  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  useEffect(() => {
    async function loadBudget() {
      setLoading(true);
      try {
        const res = await fetch('/api/budget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinationId,
            totalDays,
            travellers,
            hotelCategory,
            carRentalRequired,
            airlineIndex: initialAirlineIndex
          })
        });
        const data = await res.json();
        if (data.success && data.budget) {
          setBudgetData(data.budget);
          if (customFoodDailySGD === null) {
            setCustomFoodDailySGD(data.budget.foodTotalSGD.dailyPerPerson);
          }
          if (customAttractionsSGD === null) {
            setCustomAttractionsSGD(data.budget.attractionsTotalSGD.amount);
          }
        }
      } catch (err) {
        console.error('Failed to load budget:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBudget();
  }, [destinationId, totalDays, travellers, hotelCategory, carRentalRequired, initialAirlineIndex]);

  if (!budgetData) {
    return (
      <div className="py-12 text-center text-neutral-400">
        Calculating total trip breakdown...
      </div>
    );
  }

  // Calculate adjusted numbers if user customized food / attractions
  const activeFoodDaily = customFoodDailySGD !== null ? customFoodDailySGD : budgetData.foodTotalSGD.dailyPerPerson;
  const activeFoodTotal = activeFoodDaily * totalDays * travellers;
  const activeAttractionsTotal = customAttractionsSGD !== null ? customAttractionsSGD : budgetData.attractionsTotalSGD.amount;

  const adjustedTotalTripSGD =
    budgetData.flightTotalSGD.amount +
    budgetData.hotelTotalSGD.amount +
    budgetData.airportTransfersSGD.amount +
    budgetData.localTransportTotalSGD.amount +
    (budgetData.carRentalTotalSGD?.amount || 0) +
    (budgetData.fuelAndParkingSGD?.amount || 0) +
    activeAttractionsTotal +
    activeFoodTotal +
    budgetData.travelInsuranceSGD.amount;

  const costPerTraveller = Math.round(adjustedTotalTripSGD / Math.max(1, travellers));
  const costPerDay = Math.round(adjustedTotalTripSGD / Math.max(1, totalDays));
  const costPerTravellerPerDay = Math.round(costPerTraveller / Math.max(1, totalDays));

  return (
    <div className="space-y-8">
      {/* Top Banner with 3 Tiers Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Budget Tier */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
            Budget Tier
          </span>
          <div className="text-2xl font-bold font-mono text-neutral-200 mt-1 tabular-nums">
            {formatMoney(budgetData.budgetTierTotalSGD)}
          </div>
          <span className="text-xs text-neutral-500 block mt-1">
            Budget flights + Hostels/Clean 3★ + Local street dining
          </span>
        </div>

        {/* Comfortable Tier (Current Selected) */}
        <div className="rounded-xl border border-amber-500/80 bg-neutral-900/90 p-4 shadow-lg ring-1 ring-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Your Current Plan
            </span>
            <span className="text-[11px] font-semibold text-neutral-950 bg-amber-400 px-2 py-0.5 rounded">
              Selected
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-neutral-100 mt-1 tabular-nums">
            {formatMoney(adjustedTotalTripSGD)}
          </div>
          <span className="text-xs text-neutral-400 block mt-1">
            {travellers} travellers · {totalDays} days · {hotelCategory} tier
          </span>
        </div>

        {/* Premium Tier */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
            Premium Tier
          </span>
          <div className="text-2xl font-bold font-mono text-neutral-200 mt-1 tabular-nums">
            {formatMoney(budgetData.premiumTierTotalSGD)}
          </div>
          <span className="text-xs text-neutral-500 block mt-1">
            SQ Flagship + 5★ Resorts + Fine dining & private drivers
          </span>
        </div>
      </div>

      {/* Metrics Row: Cost per Person & Cost per Day */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <span className="text-xs text-neutral-500 block">Total for Trip</span>
          <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
            {formatMoney(adjustedTotalTripSGD)}
          </span>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <span className="text-xs text-neutral-500 block">Per Traveller</span>
          <span className="text-lg font-bold font-mono text-neutral-200 tabular-nums">
            {formatMoney(costPerTraveller)}
          </span>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <span className="text-xs text-neutral-500 block">Daily Total</span>
          <span className="text-lg font-bold font-mono text-neutral-200 tabular-nums">
            {formatMoney(costPerDay)}
          </span>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
          <span className="text-xs text-neutral-500 block">Per Person / Day</span>
          <span className="text-lg font-bold font-mono text-neutral-200 tabular-nums">
            {formatMoney(costPerTravellerPerDay)}
          </span>
        </div>
      </div>

      {/* Transparent Itemized Breakdown Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800 pb-3">
          <h4 className="text-base font-bold text-neutral-100 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-amber-400" />
            <span>Itemized Cost Transparency</span>
          </h4>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Live / Quoted</span>
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-neutral-400" />
              <span>Calibrated Estimate</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>User-Editable</span>
            </span>
          </div>
        </div>

        <div className="divide-y divide-neutral-800/80 text-sm">
          {/* Flights */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-200">Return Flights (SIN ⇄ {destinationName})</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  LIVE QUOTED
                </span>
              </div>
              <span className="text-xs text-neutral-400 block mt-0.5">
                {budgetData.flightTotalSGD.airline} · {travellers} passengers · {budgetData.flightTotalSGD.source}
              </span>
            </div>
            <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
              {formatMoney(budgetData.flightTotalSGD.amount)}
            </span>
          </div>

          {/* Accommodation */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-200">Accommodation ({hotelCategory.toUpperCase()})</span>
                <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  ESTIMATE
                </span>
              </div>
              <span className="text-xs text-neutral-400 block mt-0.5">
                {budgetData.hotelTotalSGD.nights} nights @ ~{formatMoney(budgetData.hotelTotalSGD.nightlyRate)} / night
              </span>
            </div>
            <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
              {formatMoney(budgetData.hotelTotalSGD.amount)}
            </span>
          </div>

          {/* Airport Transfers */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-200">Airport Express / Return Transfers</span>
                <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  ESTIMATE
                </span>
              </div>
              <span className="text-xs text-neutral-400 block mt-0.5">
                {budgetData.airportTransfersSGD.source} (round-trip for {travellers})
              </span>
            </div>
            <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
              {formatMoney(budgetData.airportTransfersSGD.amount)}
            </span>
          </div>

          {/* Local Transport */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-200">Local Subway / Rail / Buses</span>
                <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  ESTIMATE
                </span>
              </div>
              <span className="text-xs text-neutral-400 block mt-0.5">
                Standard daily passes and metro journeys across {totalDays} days
              </span>
            </div>
            <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
              {formatMoney(budgetData.localTransportTotalSGD.amount)}
            </span>
          </div>

          {/* Car Rental if chosen */}
          {budgetData.carRentalTotalSGD && (
            <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-200">Car Rental & Insurance</span>
                  <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                    ESTIMATE
                  </span>
                </div>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  {budgetData.carRentalTotalSGD.days} days @ ~{formatMoney(budgetData.carRentalTotalSGD.dailyRate)} / day
                </span>
              </div>
              <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
                {formatMoney(budgetData.carRentalTotalSGD.amount)}
              </span>
            </div>
          )}

          {/* User-Editable Food Allowance */}
          <div className="py-3 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-200">Food & Dining Allowance</span>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    EDITABLE
                  </span>
                </div>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  Currently: SGD {activeFoodDaily} / person / day across {totalDays} days
                </span>
              </div>
              <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
                {formatMoney(activeFoodTotal)}
              </span>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-neutral-500 font-mono">SGD 20</span>
              <input
                type="range"
                min="20"
                max="250"
                step="5"
                value={activeFoodDaily}
                onChange={e => setCustomFoodDailySGD(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-xs text-neutral-500 font-mono">SGD 250</span>
              <span className="text-xs font-mono font-bold text-amber-400 w-16 text-right">
                SGD {activeFoodDaily}/d
              </span>
            </div>
          </div>

          {/* User-Editable Attractions Allowance */}
          <div className="py-3 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-200">Sightseeing & Attractions Allowance</span>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    EDITABLE
                  </span>
                </div>
                <span className="text-xs text-neutral-400 block mt-0.5">
                  Museums, observatories, parks, and temple admissions
                </span>
              </div>
              <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
                {formatMoney(activeAttractionsTotal)}
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 pt-1">
              {[50, 100, 200, 350, 500].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCustomAttractionsSGD(amt * travellers)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                    activeAttractionsTotal === amt * travellers
                      ? 'border-amber-400 text-amber-400 bg-amber-950/40'
                      : 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  SGD {amt}/pax
                </button>
              ))}
            </div>
          </div>

          {/* Travel Insurance */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <span className="font-semibold text-neutral-200">Comprehensive Travel Insurance</span>
              <span className="text-xs text-neutral-400 block mt-0.5">
                Standard medical, flight delay, and baggage coverage
              </span>
            </div>
            <span className="text-base font-bold font-mono text-neutral-100 tabular-nums">
              {formatMoney(budgetData.travelInsuranceSGD.amount)}
            </span>
          </div>
        </div>

        {/* Final Total Bottom Bar */}
        <div className="mt-4 pt-4 border-t-2 border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block">ESTIMATED TOTAL TRIP COST</span>
            <span className="text-xs text-neutral-500">All flights, stays, transit, food and experiences</span>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
              {formatMoney(adjustedTotalTripSGD)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
