import React, { useState, useEffect } from 'react';
import { Train, Car, Navigation, Shield, CreditCard, Clock, DollarSign, Check, AlertCircle } from 'lucide-react';
import { DestinationTransitGuide, CarRentalOption } from '../types/travel.js';

interface TransitAndCarSectionProps {
  destinationId: string;
  destinationName: string;
  totalDays: number;
  carRentalRequired: boolean;
  currency: string;
  exchangeRate: number;
  onToggleCarRental: (req: boolean) => void;
}

export const TransitAndCarSection: React.FC<TransitAndCarSectionProps> = ({
  destinationId,
  destinationName,
  totalDays,
  carRentalRequired,
  currency,
  exchangeRate,
  onToggleCarRental
}) => {
  const [transitGuide, setTransitGuide] = useState<DestinationTransitGuide | null>(null);
  const [carOptions, setCarOptions] = useState<CarRentalOption[]>([]);
  const [carUsefulness, setCarUsefulness] = useState<string>('Not Needed');
  const [recommendationReason, setRecommendationReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const formatMoney = (sgdAmount: number) => {
    const converted = Math.round(sgdAmount * exchangeRate);
    if (currency === 'SGD') {
      return `SGD ${converted.toLocaleString()}`;
    }
    return `${currency} ${converted.toLocaleString()} (SGD ${sgdAmount.toLocaleString()})`;
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [transitRes, carRes] = await Promise.all([
          fetch(`/api/transit?destinationId=${destinationId}`),
          fetch(`/api/cars?destinationId=${destinationId}`)
        ]);

        const tData = await transitRes.json();
        const cData = await carRes.json();

        if (tData.success) {
          setTransitGuide(tData.transitGuide);
        }
        if (cData.success) {
          setCarOptions(cData.options || []);
          setCarUsefulness(cData.carRentalUsefulness);
          setRecommendationReason(cData.recommendationReason);
        }
      } catch (err) {
        console.error('Failed to load transit data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [destinationId]);

  return (
    <div className="space-y-8">
      {/* Strategic Transport Assessment Banner */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>Transit Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>{destinationName} Mobility Guide</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-100 mt-1">
              Getting Around {destinationName} Without a Car
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              {recommendationReason || 'Comprehensive airport connections, local rail networks, and evaluated car rental necessity.'}
            </p>
          </div>

          {/* Car Rental Need Badge */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 sm:text-right shrink-0">
            <span className="text-[11px] text-neutral-400 block">Car Rental Assessment</span>
            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded mt-1 ${
              carUsefulness === 'Not Needed'
                ? 'bg-neutral-800 text-neutral-200'
                : carUsefulness === 'Recommended'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-neutral-800 text-neutral-300'
            }`}>
              {carUsefulness}
            </span>
          </div>
        </div>
      </div>

      {/* Airport to Accommodation Transfers */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-neutral-100 flex items-center gap-2">
          <Train className="h-4 w-4 text-amber-400" />
          <span>Airport → City / Hotel Transit Options</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transitGuide?.airportToCenter.map((opt, i) => (
            <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    {opt.mode}
                  </span>
                  <h5 className="text-base font-bold text-neutral-100 mt-0.5">
                    {opt.title}
                  </h5>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-neutral-100 tabular-nums">
                    {formatMoney(opt.costSGD)}
                  </div>
                  <span className="text-[11px] text-neutral-500">per person</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 border-t border-neutral-800/80 pt-2 font-mono">
                <div>
                  <span className="text-neutral-500 block">Duration:</span>
                  <span>{opt.durationMinutes} mins</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Transfers:</span>
                  <span>{opt.transfers === 0 ? 'Direct (0 transfers)' : `${opt.transfers} transfer`}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Operating Hours:</span>
                  <span className="text-[11px]">{opt.operatingHours}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Frequency:</span>
                  <span className="text-[11px]">{opt.frequency}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 border-t border-neutral-800/80 pt-2 leading-relaxed">
                {opt.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transit Passes and Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Passes */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-amber-400" />
            <h4 className="text-base font-bold text-neutral-100">
              Recommended Transit Passes
            </h4>
          </div>

          <div className="space-y-3">
            {transitGuide?.recommendedPasses && transitGuide.recommendedPasses.length > 0 ? (
              transitGuide.recommendedPasses.map((pass, idx) => (
                <div key={idx} className="rounded-lg border border-neutral-800/80 bg-neutral-950 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-200">{pass.name}</span>
                    <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                      {pass.priceSGD > 0 ? formatMoney(pass.priceSGD) : 'Free / Direct Pay'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    <span className="font-medium text-neutral-300">Best for: </span>
                    {pass.recommendedFor}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Where to buy: {pass.whereToBuy}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-neutral-400">
                Point-to-point ride-hailing or private driver hire is recommended over public transit passes for this destination.
              </div>
            )}
          </div>

          <div className="text-xs text-neutral-400 border-t border-neutral-800 pt-3">
            <span className="font-semibold text-neutral-300">Ride-Hailing Apps: </span>
            <span>{transitGuide?.rideHailingApps.join(', ') || 'Grab'}</span>
          </div>
        </div>

        {/* Car Rental Options & Decision */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-amber-400" />
              <h4 className="text-base font-bold text-neutral-100">
                Car Rental Evaluation
              </h4>
            </div>

            <button
              type="button"
              onClick={() => onToggleCarRental(!carRentalRequired)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                carRentalRequired
                  ? 'bg-amber-400 text-neutral-950 border-amber-300'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-600'
              }`}
            >
              <div className={`h-3 w-3 rounded-xs border flex items-center justify-center ${carRentalRequired ? 'border-neutral-950 bg-neutral-950 text-amber-400' : 'border-neutral-500'}`}>
                {carRentalRequired && <Check className="h-2.5 w-2.5" />}
              </div>
              <span>{carRentalRequired ? 'Car Rental Added' : 'Add to Trip'}</span>
            </button>
          </div>

          {carOptions.map((car, idx) => {
            const totalCarCost = car.dailyRateSGD * totalDays;
            return (
              <div key={idx} className="rounded-lg border border-neutral-800/80 bg-neutral-950 p-3.5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-amber-400 font-mono font-semibold">{car.provider}</span>
                    <div className="text-sm font-bold text-neutral-100">{car.carModel}</div>
                    <span className="text-xs text-neutral-400">{car.vehicleClass} · {car.transmission}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-neutral-100 tabular-nums">
                      {formatMoney(car.dailyRateSGD)} / day
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {totalDays} days: {formatMoney(totalCarCost)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 font-mono">
                  <div>Pickup: {car.pickupLocation}</div>
                  <div>Fuel: {car.fuelPolicy}</div>
                  <div>Insurance: {car.insuranceIncluded ? 'Included' : 'Add-on'}</div>
                  <div>Mileage: {car.mileage}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
