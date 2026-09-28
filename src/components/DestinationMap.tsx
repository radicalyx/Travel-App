import React, { useState } from 'react';
import { MapPin, Navigation, Train, Building2, Car, Plane, Compass } from 'lucide-react';

interface DestinationMapProps {
  destinationName: string;
  airportCode: string;
  topAttractions: string[];
  selectedDayNumber?: number;
}

export const DestinationMap: React.FC<DestinationMapProps> = ({
  destinationName,
  airportCode,
  topAttractions,
  selectedDayNumber = 1
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'attractions' | 'transit' | 'hotel'>('all');

  // Realistic mock coordinate points around the destination center
  const mapPoints = [
    {
      id: 'airport',
      name: `${airportCode} International Airport`,
      type: 'airport',
      x: 82,
      y: 22,
      day: 1,
      transitNote: 'Direct Airport Rail Link connection'
    },
    {
      id: 'hotel',
      name: 'Central Accommodations Hub',
      type: 'hotel',
      x: 48,
      y: 52,
      day: 1,
      transitNote: 'Near central subway interchange'
    },
    {
      id: 'attraction-1',
      name: topAttractions[0] || 'Main Landmark',
      type: 'attraction',
      x: 35,
      y: 42,
      day: 1,
      transitNote: '12 min walk from hotel'
    },
    {
      id: 'attraction-2',
      name: topAttractions[1] || 'Cultural Quarter',
      type: 'attraction',
      x: 60,
      y: 65,
      day: 2,
      transitNote: 'Metro Line 2 (4 stops)'
    },
    {
      id: 'attraction-3',
      name: topAttractions[2] || 'Historic Park',
      type: 'attraction',
      x: 70,
      y: 38,
      day: 3,
      transitNote: 'Transit bus 15 min'
    },
    {
      id: 'station',
      name: 'Central Railway Terminal',
      type: 'station',
      x: 45,
      y: 58,
      day: 1,
      transitNote: 'High-speed rail connections'
    }
  ];

  const visiblePoints = mapPoints.filter(pt => {
    if (activeFilter === 'attractions') return pt.type === 'attraction';
    if (activeFilter === 'transit') return pt.type === 'airport' || pt.type === 'station';
    if (activeFilter === 'hotel') return pt.type === 'hotel';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-neutral-100 flex items-center gap-2">
            <Compass className="h-4 w-4 text-amber-400" />
            <span>Interactive Route & Landmarks Map</span>
          </h4>
          <span className="text-xs text-neutral-400">
            Plotting key transit hubs, recommended stays, and day attractions in {destinationName}
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
          {(['all', 'attractions', 'transit', 'hotel'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                activeFilter === f
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative h-96 w-full rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-inner">
        {/* Background Grid & Contour Map Styling */}
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        {/* Abstract river / transit lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none stroke-neutral-800" strokeWidth="2">
          <path d="M 0 160 Q 200 120 400 240 T 800 280" fill="none" stroke="#1e293b" strokeWidth="12" />
          <path d="M 0 160 Q 200 120 400 240 T 800 280" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          {/* Connector route between hotel and attractions */}
          <line x1="48%" y1="52%" x2="35%" y2="42%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
          <line x1="48%" y1="52%" x2="60%" y2="65%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
        </svg>

        {/* Interactive Points */}
        {visiblePoints.map(pt => {
          const isAirport = pt.type === 'airport';
          const isHotel = pt.type === 'hotel';
          const isStation = pt.type === 'station';

          return (
            <div
              key={pt.id}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              {/* Marker pin */}
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg transition-transform group-hover:scale-125 ${
                isAirport
                  ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
                  : isHotel
                  ? 'border-amber-400 bg-amber-950 text-amber-300'
                  : isStation
                  ? 'border-emerald-400 bg-emerald-950 text-emerald-300'
                  : 'border-rose-400 bg-rose-950 text-rose-300'
              }`}>
                {isAirport && <Plane className="h-4 w-4" />}
                {isHotel && <Building2 className="h-4 w-4" />}
                {isStation && <Train className="h-4 w-4" />}
                {!isAirport && !isHotel && !isStation && <MapPin className="h-4 w-4" />}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:block z-30 min-w-44 rounded-lg border border-neutral-700 bg-neutral-900/95 p-2.5 text-xs text-neutral-200 shadow-xl backdrop-blur-sm pointer-events-none">
                <div className="font-bold text-neutral-100">{pt.name}</div>
                <div className="text-[11px] text-amber-400 mt-0.5">{pt.transitNote}</div>
              </div>
            </div>
          );
        })}

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-3 bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-lg px-3 py-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Airport</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Hotel</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-300">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span>Attraction</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Transit Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
