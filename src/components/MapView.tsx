import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Star, Flame, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Restaurant } from '../types';

interface MapViewProps {
  restaurants: Restaurant[];
  currentLocationName: string;
  userCoords: { lat: number; lng: number };
  onSelectRestaurant: (r: Restaurant) => void;
  onSelectLocationPin: (locName: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  restaurants,
  currentLocationName,
  userCoords,
  onSelectRestaurant,
}) => {
  const [selectedPlace, setSelectedPlace] = useState<Restaurant | null>(restaurants[0] || null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Compute map bounds or relative coordinates for SVG projection
  // To provide an engaging visual experience without external third-party API keys that could get blocked:
  return (
    <div className="bg-stone-100 rounded-2xl border border-stone-200 overflow-hidden shadow-sm relative flex flex-col h-[650px]">
      
      {/* Top Map Control Bar */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">
              Live Halal Radar & Map Interface
            </h3>
            <p className="text-[11px] text-stone-500">
              Center: <span className="font-semibold text-stone-800">{currentLocationName}</span> ({userCoords.lat.toFixed(2)}, {userCoords.lng.toFixed(2)})
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
            <span>Your GPS Pin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
            <span>Verified Halal ({restaurants.length})</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative flex-1 bg-[#f4f1ea] overflow-hidden select-none">
        
        {/* Stylized Cartographic SVG Layer */}
        <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Grid / Streets */}
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e7e3da" strokeWidth="1" />
            </pattern>
            {/* Water texture */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dcebf2" />
              <stop offset="100%" stopColor="#cde2ec" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Stylized Coastline / River Arteries */}
          <path
            d="M -50,420 Q 200,380 450,450 T 900,430 T 1400,470 L 1400,700 L -50,700 Z"
            fill="url(#waterGrad)"
            opacity="0.85"
          />

          {/* Arterial Avenues */}
          <path d="M 0,220 Q 400,240 800,200 T 1400,250" fill="none" stroke="#ded9ce" strokeWidth="12" />
          <path d="M 450,0 Q 480,300 460,700" fill="none" stroke="#ded9ce" strokeWidth="10" />
          <path d="M 850,0 Q 820,300 890,700" fill="none" stroke="#ded9ce" strokeWidth="8" />

          {/* Concentric GPS Distance Circles around center */}
          <circle cx="50%" cy="50%" r="90" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
          <text x="50%" y="calc(50% - 95px)" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">
            Within 400m
          </text>

          <circle cx="50%" cy="50%" r="180" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <text x="50%" y="calc(50% - 185px)" textAnchor="middle" fill="#0284c7" fontSize="10">
            Within 0.5 mi (800m)
          </text>

          <circle cx="50%" cy="50%" r="280" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
          <text x="50%" y="calc(50% - 285px)" textAnchor="middle" fill="#0284c7" fontSize="10">
            Within 1.0 mi (1.6 km)
          </text>

          {/* Active Route Line if a place is selected */}
          {selectedPlace && (
            <line
              x1="50%"
              y1="50%"
              x2={`${35 + (selectedPlace.longitude % 1) * 35}%`}
              y2={`${30 + (selectedPlace.latitude % 1) * 40}%`}
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
          )}
        </svg>

        {/* User GPS Center Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="w-8 h-8 rounded-full bg-blue-500/20 animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <Navigation className="w-2.5 h-2.5 fill-current" />
            </div>
          </div>
          <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 shadow-md">
            You Are Here
          </span>
        </div>

        {/* Interactive Restaurant Markers scattered around visual radius */}
        {restaurants.map((place, idx) => {
          // Generate deterministic coordinates on map canvas based on index & lat/lng
          const leftPercent = 25 + ((idx * 17) % 55) + ((place.longitude * 10) % 15);
          const topPercent = 20 + ((idx * 23) % 55) + ((place.latitude * 10) % 15);
          const isSelected = selectedPlace?.id === place.id;

          return (
            <div
              key={place.id}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => setSelectedPlace(place)}
                className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg border transition-transform hover:scale-110 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 border-amber-600 scale-110 ring-4 ring-amber-500/30'
                    : 'bg-white text-stone-900 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold whitespace-nowrap max-w-[120px] truncate">
                  {place.name.split('–')[0].trim()}
                </span>
                <span className="text-[10px] font-mono font-bold text-stone-500">
                  {place.distanceKm < 0.4 ? '400m' : `${place.distanceKm.toFixed(1)}k`}
                </span>
              </button>
            </div>
          );
        })}

        {/* Floating Selected Place Callout Card */}
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-stone-200 z-30 animate-fade-in">
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3">
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== window.location.origin + '/images/hero_halal_dining_spread.jpg') {
                    target.src = '/images/hero_halal_dining_spread.jpg';
                  }
                }}
              />
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{selectedPlace.halalStatus.certificationBody}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 truncate">
                  {selectedPlace.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    {selectedPlace.rating.toFixed(1)}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-rose-600 flex items-center">
                    <Flame className="w-3 h-3 mr-0.5" />
                    Lv{selectedPlace.spiceLevel}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{selectedPlace.priceRange}</span>
                </div>
                <p className="text-[11px] text-stone-500 truncate mt-1">
                  {selectedPlace.address}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-600">
                Distance: <strong className="text-stone-900">{selectedPlace.distanceKm.toFixed(2)} km</strong>
              </span>
              <button
                type="button"
                onClick={() => onSelectRestaurant(selectedPlace)}
                className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1"
              >
                <span>View Menu & Proof</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
