import React from 'react';
import { Star, MapPin, Flame, Bookmark, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const getSpiceText = (level: number) => {
    switch (level) {
      case 0: return 'No Spice';
      case 1: return 'Mild (1/5)';
      case 2: return 'Medium (2/5)';
      case 3: return 'Hot (3/5)';
      case 4: return 'Extra Hot (4/5)';
      case 5: return 'Ghost Pepper (5/5)';
      default: return 'Medium';
    }
  };

  const getDistanceDisplay = (distKm: number) => {
    if (distKm < 0.4) {
      return `${(distKm * 1000).toFixed(0)}m · Within 400m`;
    }
    if (distKm <= 0.8) {
      return `${distKm.toFixed(2)} km · Within 0.5 mi`;
    }
    if (distKm <= 1.6) {
      return `${distKm.toFixed(1)} km · Within 1 mi`;
    }
    return `${distKm.toFixed(1)} km`;
  };

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Card Image Slot with Fallback Container */}
        <div className="relative h-48 w-full overflow-hidden bg-stone-100">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== window.location.origin + '/images/hero_halal_dining_spread.jpg') {
                target.src = '/images/hero_halal_dining_spread.jpg';
              }
            }}
          />

          {/* Open/Closed indicator overlay */}
          <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${restaurant.isOpenNow ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span>{restaurant.isOpenNow ? 'Open Now' : 'Closed'}</span>
            <span className="text-stone-400 font-mono text-[10px]">· {restaurant.openingHours.split('–')[0]}</span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => onToggleFavorite(restaurant.id, e)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
              isFavorite
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-white/90 text-stone-700 hover:bg-white'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Save to favorites'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Halal Certification Stamp */}
          <div className="absolute bottom-3 left-3 bg-white/95 text-stone-900 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[200px]">{restaurant.halalStatus.certificationBody}</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 sm:p-5">
          
          {/* Metadata line (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 flex-wrap">
            <span className="font-medium text-amber-700">{restaurant.cuisine}</span>
            <span aria-hidden="true">·</span>
            <span>{restaurant.neighborhood}, {restaurant.city}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-700 font-medium">{restaurant.priceRange}</span>
          </div>

          {/* Restaurant Title & Native Name */}
          <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1 font-display">
            {restaurant.name}
          </h3>
          {restaurant.nativeName && (
            <p className="text-xs text-stone-500 font-medium -mt-0.5 mb-2 line-clamp-1">
              {restaurant.nativeName}
            </p>
          )}

          {/* Ratings & GPS Distance */}
          <div className="flex items-center gap-3 text-xs text-stone-600 mt-2 mb-3">
            <div className="flex items-center gap-1 font-semibold text-stone-900">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="text-stone-400 font-normal">({restaurant.reviewCount})</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 font-medium text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{getDistanceDisplay(restaurant.distanceKm)}</span>
            </div>
          </div>

          {/* Spice Meter Line */}
          <div className="flex items-center gap-2 text-xs py-1.5 px-2.5 bg-rose-50/70 border border-rose-100 rounded-lg text-rose-900 mb-3">
            <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500 shrink-0" />
            <span className="font-semibold">Spice Meter:</span>
            <span className="text-rose-800">{getSpiceText(restaurant.spiceLevel)}</span>
            <span className="ml-auto font-mono text-[11px] text-rose-600">
              {'🌶️'.repeat(Math.max(1, restaurant.spiceLevel))}
            </span>
          </div>

          {/* Signature Dish Highlights */}
          {restaurant.featuredFoods.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-stone-100">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                Signature Halal Dishes:
              </div>
              <div className="space-y-1 text-xs text-stone-700">
                {restaurant.featuredFoods.slice(0, 2).map((dish) => (
                  <div key={dish.name} className="flex items-center justify-between gap-2">
                    <span className="truncate text-stone-800 font-medium">
                      {dish.name}
                    </span>
                    <span className="font-mono text-stone-500 text-[11px] shrink-0">
                      {dish.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Card Footer Action */}
      <div className="px-4 py-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-700 group-hover:text-stone-900">
        <span className="text-emerald-700 font-medium flex items-center gap-1">
          {restaurant.halalStatus.noAlcoholServed ? '✓ Alcohol-Free' : 'Segregated Halal Kitchen'}
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          View Menu & Reviews <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
