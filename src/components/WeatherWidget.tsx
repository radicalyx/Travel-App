import React, { useState, useEffect } from 'react';
import { CloudSun, Thermometer, Umbrella, Info } from 'lucide-react';
import { WeatherInfo } from '../types/travel.js';

interface WeatherWidgetProps {
  destinationId: string;
  destinationName: string;
  targetDate: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  destinationId,
  destinationName,
  targetDate
}) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?destinationId=${destinationId}&date=${targetDate}`);
        const data = await res.json();
        if (data.success && data.weather) {
          setWeather(data.weather);
        }
      } catch (err) {
        console.error('Failed to load weather:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [destinationId, targetDate]);

  if (!weather) return null;

  const isForecast = weather.type === 'forecast';

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      {/* Header with Type label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudSun className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-bold text-neutral-100">
            Weather & Climate Outlook
          </span>
        </div>

        {/* Clear label distinguishing forecast vs seasonal expectations */}
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
          isForecast
            ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/60'
            : 'text-amber-400 bg-amber-950/60 border border-amber-800/60'
        }`}>
          {isForecast ? 'LIVE 14-DAY FORECAST' : 'HISTORICAL CLIMATE / SEASONAL EXPECTATION'}
        </span>
      </div>

      {/* Main Temperature and Condition */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
            {weather.tempMinC}°C – {weather.tempMaxC}°C
          </div>
          <span className="text-xs text-neutral-300 font-medium">
            {weather.condition}
          </span>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-neutral-400 justify-end">
            <Umbrella className="h-3.5 w-3.5 text-neutral-400" />
            <span className="font-mono tabular-nums">{weather.precipitationChancePercent}% chance</span>
          </div>
          <span className="text-[11px] text-neutral-500">
            Precipitation
          </span>
        </div>
      </div>

      {/* Recommendation and Source */}
      <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-2">
        {weather.recommendation}
      </p>

      <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between border-t border-neutral-800/40 pt-1.5">
        <span>Source: {weather.source}</span>
        <span>Retrieved: {new Date(weather.retrievedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
