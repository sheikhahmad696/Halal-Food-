import React, { useState } from 'react';
import { Search, MapPin, Navigation, Clock, Truck, ChevronDown, Sparkles } from 'lucide-react';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRadius: string; // '400m' | '0.2mi' | '0.5mi' | '1mi' | '5mi' | '10mi' | 'all'
  onRadiusChange: (radius: string) => void;
  openNowOnly: boolean;
  onToggleOpenNow: () => void;
  deliveryOnly: boolean;
  onToggleDelivery: () => void;
  currentLocationName: string;
  onSelectSimulatedLocation: (loc: { name: string; city: string; lat: number; lng: number }) => void;
  onQuickKeywordClick: (keyword: string) => void;
}

export const SIMULATED_LOCATIONS = [
  { name: 'Singapore (Toa Payoh Central)', city: 'Singapore', lat: 1.3328, lng: 103.8475 },
  { name: 'South Korea (Busan Haeundae)', city: 'Busan', lat: 35.1612, lng: 129.1585 },
  { name: 'South Korea (Seoul Itaewon)', city: 'Seoul', lat: 37.5342, lng: 126.9984 },
  { name: 'Thailand (Krabi Ao Nang Beach)', city: 'Krabi', lat: 8.0321, lng: 98.8242 },
  { name: 'Thailand (Bangkok Ratchathewi)', city: 'Bangkok', lat: 13.7314, lng: 100.5645 },
  { name: 'United Kingdom (London Whitechapel)', city: 'London', lat: 51.5173, lng: -0.0658 },
  { name: 'United States (New York Manhattan)', city: 'New York', lat: 40.7619, lng: -73.9796 },
  { name: 'Canada (Toronto Dundas / Brampton)', city: 'Toronto', lat: 43.6534, lng: -79.3797 },
  { name: 'Pakistan (Bahawalpur Darbar Road)', city: 'Bahawalpur', lat: 29.3957, lng: 71.6833 },
  { name: 'India (Delhi Jama Masjid)', city: 'Delhi', lat: 28.6507, lng: 77.2334 },
  { name: 'Malaysia (Kuala Lumpur Damansara)', city: 'Kuala Lumpur', lat: 3.1368, lng: 101.6225 },
  { name: 'Australia (Sydney Lakemba)', city: 'Sydney', lat: -33.9189, lng: 151.0768 },
];

const POPULAR_KEYWORDS = [
  'Halal food near Toa Payoh',
  'Halal food in Busan Near me',
  'May and Zin restaurant',
  'halal tomyam near me',
  'bahawalpur food point menu',
  "shah's halal food near me",
  'Is Korean KFC halal?',
  'zabiha halal restaurants near me',
  'halal food near me within 400m',
  'halal food near me open now',
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  onSearchChange,
  selectedRadius,
  onRadiusChange,
  openNowOnly,
  onToggleOpenNow,
  deliveryOnly,
  onToggleDelivery,
  currentLocationName,
  onSelectSimulatedLocation,
  onQuickKeywordClick,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  return (
    <div className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0 opacity-35">
        <img
          src="/images/hero_halal_dining_spread.jpg"
          alt="Artisanal Halal feast"
          className="w-full h-full object-cover object-center filter saturate-90 brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-900/90" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Editorial Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">
            Verified Global Halal Directory · 10 Countries · 35+ Destination Guides
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 font-display [text-wrap:balance]">
            Discover Halal Food Near You With Absolute Confidence
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Search live distance radii, check authentic spice levels from mild to ghost pepper, filter dietary needs, and inspect verified HMC, MUIS, JAKIM, KMF, and CICOT certifications.
          </p>
        </div>

        {/* Search & Location Bar Module */}
        <div className="bg-white rounded-2xl shadow-xl p-3 md:p-4 text-stone-900 max-w-4xl mx-auto border border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="relative md:col-span-7 flex items-center pl-3">
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search food, city, cuisine or keywords (e.g. Toa Payoh, Busan, Tomyam, Bahawalpur)..."
                className="w-full pl-3 pr-3 py-2 text-sm text-stone-900 bg-transparent placeholder-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* GPS Location Selector Dropdown */}
            <div className="relative md:col-span-5 border-t md:border-t-0 md:border-l border-stone-200 pt-2 md:pt-0 pl-0 md:pl-3">
              <button
                type="button"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Navigation className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-medium">GPS Location Pin</span>
                    <span className="text-xs font-semibold text-stone-800 truncate block">
                      {currentLocationName}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
              </button>

              {/* Location selection list */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 p-2 z-50 max-h-64 overflow-y-auto">
                  <div className="text-[11px] font-semibold text-stone-500 px-2 py-1 uppercase tracking-wider">
                    Select Virtual GPS Coordinates:
                  </div>
                  {SIMULATED_LOCATIONS.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => {
                        onSelectSimulatedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-amber-50 hover:text-amber-900 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-stone-800">{loc.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {loc.lat.toFixed(2)}, {loc.lng.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Distance Radius and Toggles */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Radius Segmented Controls */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              <span className="text-stone-500 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Distance:
              </span>
              {[
                { label: 'All', value: 'all' },
                { label: 'Within 400m', value: '400m' },
                { label: '0.2 mi', value: '0.2mi' },
                { label: '0.5 mi', value: '0.5mi' },
                { label: '1 mi', value: '1mi' },
                { label: '5 mi', value: '5mi' },
                { label: '10 mi', value: '10mi' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onRadiusChange(item.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedRadius === item.value
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Quick Toggles */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onToggleOpenNow}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  openNowOnly
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Open Now</span>
              </button>

              <button
                type="button"
                onClick={onToggleDelivery}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  deliveryOnly
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEO Keyword Pills for Instant User Filtering */}
        <div className="mt-5 max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 text-xs text-stone-300">
          <span className="font-semibold text-amber-400 whitespace-nowrap flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            Popular Queries:
          </span>
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => onQuickKeywordClick(kw)}
              className="px-2.5 py-1 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700/60 transition-colors whitespace-nowrap shrink-0"
            >
              {kw}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
