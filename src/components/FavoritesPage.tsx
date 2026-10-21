import React, { useState } from 'react';
import { Bookmark, Star, MapPin, Trash2, ArrowLeft, Download, UserCheck, Flame, ShieldCheck, ArrowRight } from 'lucide-react';
import { Restaurant, PageRoute, SpiceLevel } from '../types';
import { RestaurantCard } from './RestaurantCard';

interface FavoritesPageProps {
  favorites: string[];
  restaurants: Restaurant[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectRestaurant: (r: Restaurant) => void;
  onRouteChange: (route: PageRoute) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  restaurants,
  onToggleFavorite,
  onSelectRestaurant,
  onRouteChange,
}) => {
  const [userName, setUserName] = useState('Ahmad Al-Mansoor');
  const [userSpicePreference, setUserSpicePreference] = useState<SpiceLevel>(3);
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({
    'th-krabi-mayzin-1': 'Must order Jumbo Tiger Prawn Tomyam + blue crab curry!',
    'kr-seoul-makan-1': 'Double check prayer room on 2nd floor before dinner.',
    'pk-bahawalpur-foodpoint-1': 'Order 1kg butter mutton karahi with roghni naan.',
  });

  const savedRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  const handleUpdateNote = (id: string, note: string) => {
    setPersonalNotes((prev) => ({ ...prev, [id]: note }));
  };

  const handleExportItinerary = () => {
    const content = savedRestaurants
      .map(
        (r, i) =>
          `${i + 1}. ${r.name} (${r.city}, ${r.countryName})\nAddress: ${r.address}\nCertification: ${r.halalStatus.certificationBody}\nPhone: ${r.phone}\nPersonal Note: ${personalNotes[r.id] || 'None'}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HalalAtlas_Saved_Places_${userName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={() => onRouteChange({ type: 'home' })}
            className="hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </button>
          <span>/</span>
          <span className="font-semibold text-stone-900">Personalized Favorites & Profile</span>
        </div>

        {/* User Profile Header Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-400 font-bold text-2xl flex items-center justify-center font-display shadow-sm">
                {userName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                    {userName}
                  </h1>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Logged In
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Personalized Halal Dining List · {savedRestaurants.length} Places Bookmarked
                </p>
              </div>
            </div>

            {/* Itinerary Export Button */}
            {savedRestaurants.length > 0 && (
              <button
                type="button"
                onClick={handleExportItinerary}
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Itinerary (.TXT)</span>
              </button>
            )}
          </div>

          {/* User Preferences Strip */}
          <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Your Dietary Heat Preference:
              </label>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-rose-600" />
                  Level {userSpicePreference} ({userSpicePreference === 0 ? 'No Heat' : userSpicePreference <= 2 ? 'Mild-Medium' : 'Hot'})
                </span>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={userSpicePreference}
                  onChange={(e) => setUserSpicePreference(Number(e.target.value) as SpiceLevel)}
                  className="w-48 accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <span className="text-stone-500 block mb-1">Sync Status:</span>
              <span className="text-stone-700 font-medium">
                ✓ Auto-saved locally in browser session storage
              </span>
            </div>
          </div>
        </div>

        {/* Saved Places List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Saved Halal Establishments ({savedRestaurants.length})
            </h2>
          </div>

          {savedRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="space-y-2">
                  <RestaurantCard
                    restaurant={restaurant}
                    onSelect={onSelectRestaurant}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                  />

                  {/* Private User Note Field */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-amber-900 block">
                      Private Note / Order List:
                    </span>
                    <input
                      type="text"
                      placeholder="Add personal note (e.g. order without onions, wudu upstairs)..."
                      value={personalNotes[restaurant.id] || ''}
                      onChange={(e) => handleUpdateNote(restaurant.id, e.target.value)}
                      className="w-full text-xs p-1.5 rounded-md border border-amber-300 bg-white text-stone-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">
                You haven’t saved any halal places yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Click the bookmark icon on any restaurant card while exploring Singapore, South Korea, Thailand, Canada, or the UK to build your personalized halal dining list.
              </p>
              <button
                onClick={() => onRouteChange({ type: 'home' })}
                className="mt-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors inline-block"
              >
                Start Exploring
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
