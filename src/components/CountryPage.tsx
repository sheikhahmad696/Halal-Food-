import React from 'react';
import { ShieldCheck, MapPin, Sparkles, Utensils, BookOpen, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { CountryHub, Restaurant, PageRoute } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { COUNTRIES_DATA } from '../data/countries';
import { CITIES_DATA } from '../data/cities';

interface CountryPageProps {
  country: CountryHub;
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onRouteChange: (route: PageRoute) => void;
}

export const CountryPage: React.FC<CountryPageProps> = ({
  country,
  restaurants,
  onSelectRestaurant,
  favorites,
  onToggleFavorite,
  onRouteChange,
}) => {
  const countryRestaurants = restaurants.filter(
    (r) => r.country.toLowerCase() === country.code.toLowerCase()
  );

  const relevantCityHubs = CITIES_DATA.filter(
    (c) => c.countryCode.toLowerCase() === country.code.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={() => onRouteChange({ type: 'home' })}
            className="hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Global Finder
          </button>
          <span>/</span>
          <span>Countries</span>
          <span>/</span>
          <span className="font-semibold text-stone-900">{country.name}</span>
        </div>

        {/* Country Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-white min-h-[300px] flex items-end p-6 sm:p-10 shadow-lg">
          <img
            src={country.heroImage}
            alt={country.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 filter saturate-90"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== window.location.origin + '/images/hero_halal_dining_spread.jpg') {
                target.src = '/images/hero_halal_dining_spread.jpg';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
              <span className="text-2xl">{country.flag}</span>
              <span className="tracking-widest uppercase">{country.nativeName}</span>
              <span>·</span>
              <span className="text-stone-300 font-normal">{country.certBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight text-white">
              Halal Food Guide & Verified Dining in {country.name}
            </h1>

            <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
              {country.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 px-3 py-1 rounded-md font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Supervisory Body: {country.certificationAuthority}
              </span>
              <span className="bg-stone-800/80 text-stone-300 px-3 py-1 rounded-md font-mono">
                {countryRestaurants.length} Verified Outlets
              </span>
            </div>
          </div>
        </div>

        {/* Country Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
            Switch Country:
          </span>
          {COUNTRIES_DATA.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onRouteChange({ type: 'country', countryCode: c.code })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                country.code === c.code
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Key City & Neighborhood Hubs */}
        {relevantCityHubs.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <h2 className="text-base font-bold text-stone-900 mb-1 font-display">
              Explore Neighborhood Hubs in {country.name}
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Detailed hyper-local district guides answering exact street-level queries.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relevantCityHubs.map((hub) => (
                <button
                  key={hub.slug}
                  onClick={() => onRouteChange({ type: 'city', citySlug: hub.slug })}
                  className="text-left p-3.5 rounded-lg border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900 group-hover:text-amber-800">
                      {hub.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 group-hover:text-amber-800 transition-transform" />
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    {hub.headline}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Verified Restaurant Outlets in Country */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                Featured Halal Restaurants in {country.name}
              </h2>
              <p className="text-xs text-stone-500">
                Audited with full spice meter transparency, diet tags, and certificate proofs.
              </p>
            </div>
          </div>

          {countryRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelect={onSelectRestaurant}
                  isFavorite={favorites.includes(restaurant.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
              <p className="text-sm text-stone-600">
                No outlets matching current strict filter. Try expanding search or resetting filters.
              </p>
            </div>
          )}
        </div>

        {/* SEO Keywords Search Queries Box for this Country */}
        <div className="bg-stone-100 rounded-xl p-5 border border-stone-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
            Target Search Keywords & Verified Topics for {country.name}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {country.seoKeywords.map((kw) => (
              <span
                key={kw}
                className="text-xs bg-white text-stone-700 px-2.5 py-1 rounded-md border border-stone-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
