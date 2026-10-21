import React from 'react';
import { MapPin, ShieldCheck, ArrowLeft, ArrowRight, Utensils, CheckCircle } from 'lucide-react';
import { CityHub, Restaurant, PageRoute } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { CITIES_DATA } from '../data/cities';

interface CityHubPageProps {
  cityHub: CityHub;
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onRouteChange: (route: PageRoute) => void;
}

export const CityHubPage: React.FC<CityHubPageProps> = ({
  cityHub,
  restaurants,
  onSelectRestaurant,
  favorites,
  onToggleFavorite,
  onRouteChange,
}) => {
  // Filter restaurants matching this city or neighborhood
  const hubRestaurants = restaurants.filter((r) => {
    const q = cityHub.name.toLowerCase();
    const areas = cityHub.popularAreas.map((a) => a.toLowerCase());
    return (
      r.city.toLowerCase().includes(cityHub.name.split('–')[0].trim().toLowerCase()) ||
      q.includes(r.neighborhood.toLowerCase()) ||
      areas.some((area) => r.neighborhood.toLowerCase().includes(area) || r.address.toLowerCase().includes(area)) ||
      r.country.toLowerCase() === cityHub.countryCode.toLowerCase()
    );
  });

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={() => onRouteChange({ type: 'country', countryCode: cityHub.countryCode })}
            className="hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {cityHub.countryName}
          </button>
          <span>/</span>
          <span>Neighborhood Hubs</span>
          <span>/</span>
          <span className="font-semibold text-stone-900">{cityHub.name}</span>
        </div>

        {/* City Hub Header Banner */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold tracking-wider uppercase">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{cityHub.countryName} Halal Enclave Hub</span>
                {cityHub.nativeName && (
                  <>
                    <span>·</span>
                    <span className="text-stone-500 font-medium">{cityHub.nativeName}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 font-display">
                {cityHub.headline}
              </h1>

              <p className="text-stone-600 text-sm leading-relaxed">
                {cityHub.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-stone-700">Key Focus Areas:</span>
                {cityHub.popularAreas.map((area) => (
                  <span
                    key={area}
                    className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md border border-stone-200 font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick SEO Query Badge */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 shrink-0 max-w-sm w-full lg:w-72">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500 block mb-1">
                Optimized Search Query:
              </span>
              <div className="font-mono text-xs font-semibold text-stone-900 bg-white p-2.5 rounded-lg border border-stone-200 mb-2">
                "{cityHub.seoQuery}"
              </div>
              <div className="text-[11px] text-stone-500">
                Matched against live GPS radii (400m to 10 mi) & certification tags.
              </div>
            </div>
          </div>
        </div>

        {/* Other City Hubs in Directory */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-stone-500 whitespace-nowrap">
            All District Hubs:
          </span>
          {CITIES_DATA.map((ch) => (
            <button
              key={ch.slug}
              onClick={() => onRouteChange({ type: 'city', citySlug: ch.slug })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                ch.slug === cityHub.slug
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {ch.name.split('–')[1]?.trim() || ch.name}
            </button>
          ))}
        </div>

        {/* Restaurants in Hub */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                Verified Halal Spots in {cityHub.name}
              </h2>
              <p className="text-xs text-stone-500">
                Showing {hubRestaurants.length} audited establishments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={onSelectRestaurant}
                isFavorite={favorites.includes(restaurant.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
