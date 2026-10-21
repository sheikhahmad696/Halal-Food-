/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSearch, SIMULATED_LOCATIONS } from './components/HeroSearch';
import { FiltersBar } from './components/FiltersBar';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantModal } from './components/RestaurantModal';
import { MapView } from './components/MapView';
import { CountryPage } from './components/CountryPage';
import { CityHubPage } from './components/CityHubPage';
import { BlogPage } from './components/BlogPage';
import { ForumPage } from './components/ForumPage';
import { CertificationsPage } from './components/CertificationsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { Footer } from './components/Footer';

import { RESTAURANTS_DATA } from './data/restaurants';
import { COUNTRIES_DATA } from './data/countries';
import { CITIES_DATA } from './data/cities';
import { FORUM_THREADS } from './data/forum';
import { PageRoute, Restaurant, UserReview, DietaryTag, SpiceLevel } from './types';
import { MapPin, Compass, Flame, ShieldCheck, ArrowRight, UtensilsCrossed } from 'lucide-react';

export default function App() {
  // Navigation Route State
  const [currentRoute, setCurrentRoute] = useState<PageRoute>({ type: 'home' });

  // Virtual GPS Location Pin
  const [currentLocation, setCurrentLocation] = useState(SIMULATED_LOCATIONS[0]); // Defaults to Singapore (Toa Payoh Central)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState<string>('all'); // '400m' | '0.2mi' | '0.5mi' | '1mi' | '5mi' | '10mi' | 'all'
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel | 'all'>('all');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [selectedCert, setSelectedCert] = useState<string>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All Cuisines');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [alcoholFreeOnly, setAlcoholFreeOnly] = useState(false);
  const [prayerRoomOnly, setPrayerRoomOnly] = useState(false);

  // Restaurant & Reviews Data State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS_DATA);
  const [selectedModalRestaurant, setSelectedModalRestaurant] = useState<Restaurant | null>(null);

  // Community Forum State
  const [forumThreads, setForumThreads] = useState(FORUM_THREADS);

  // User Favorites State (Persisted in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('halalatlas_favorites');
      return saved ? JSON.parse(saved) : ['sg-toa-payoh-1', 'kr-seoul-makan-1', 'th-krabi-mayzin-1', 'pk-bahawalpur-foodpoint-1'];
    } catch {
      return ['sg-toa-payoh-1', 'kr-seoul-makan-1', 'th-krabi-mayzin-1', 'pk-bahawalpur-foodpoint-1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('halalatlas_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add Review Handler
  const handleAddReview = (restaurantId: string, review: UserReview) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          const updatedReviews = [review, ...r.reviews];
          const newAvgRating =
            updatedReviews.reduce((sum, item) => sum + item.rating, 0) / updatedReviews.length;
          return {
            ...r,
            rating: Number(newAvgRating.toFixed(1)),
            reviewCount: r.reviewCount + 1,
            reviews: updatedReviews,
          };
        }
        return r;
      })
    );

    if (selectedModalRestaurant?.id === restaurantId) {
      setSelectedModalRestaurant((prev) =>
        prev
          ? {
              ...prev,
              reviews: [review, ...prev.reviews],
              reviewCount: prev.reviewCount + 1,
            }
          : null
      );
    }
  };

  // Upvote Thread Handler
  const handleUpvoteThread = (threadId: string) => {
    setForumThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  // Add Thread Handler
  const handleAddThread = (newThread: any) => {
    setForumThreads((prev) => [newThread, ...prev]);
  };

  // Add Reply Handler
  const handleAddReply = (threadId: string, replyText: string, authorName: string) => {
    setForumThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const newRep = {
            id: `rep-${Date.now()}`,
            author: authorName,
            verified: true,
            date: 'Just now',
            content: replyText,
            upvotes: 1,
          };
          return {
            ...t,
            repliesCount: t.repliesCount + 1,
            replies: [...t.replies, newRep],
          };
        }
        return t;
      })
    );
  };

  // Distance computation (Haversine Formula) relative to current active GPS pin
  const restaurantsWithComputedDistance = useMemo(() => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    return restaurants.map((place) => {
      const dLat = toRad(place.latitude - currentLocation.lat);
      const dLon = toRad(place.longitude - currentLocation.lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(currentLocation.lat)) *
          Math.cos(toRad(place.latitude)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distKm = R * c;

      return {
        ...place,
        distanceKm: Number(distKm.toFixed(2)),
      };
    });
  }, [restaurants, currentLocation]);

  // Radius limit in km
  const radiusLimitKm = useMemo(() => {
    switch (selectedRadius) {
      case '400m': return 0.4;
      case '0.2mi': return 0.32;
      case '0.5mi': return 0.8;
      case '1mi': return 1.6;
      case '5mi': return 8.0;
      case '10mi': return 16.0;
      default: return Infinity;
    }
  }, [selectedRadius]);

  // Filter Logic
  const filteredRestaurants = useMemo(() => {
    return restaurantsWithComputedDistance.filter((place) => {
      // Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = place.name.toLowerCase().includes(q);
        const matchesCity = place.city.toLowerCase().includes(q);
        const matchesNeighborhood = place.neighborhood.toLowerCase().includes(q);
        const matchesCountry = place.countryName.toLowerCase().includes(q);
        const matchesCuisine = place.cuisine.toLowerCase().includes(q);
        const matchesCert = place.halalStatus.certificationBody.toLowerCase().includes(q);
        const matchesKeywords = place.keywords.some((k) => k.toLowerCase().includes(q));
        const matchesFoods = place.featuredFoods.some(
          (f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
        );

        if (
          !matchesName &&
          !matchesCity &&
          !matchesNeighborhood &&
          !matchesCountry &&
          !matchesCuisine &&
          !matchesCert &&
          !matchesKeywords &&
          !matchesFoods
        ) {
          return false;
        }
      }

      // Radius filter
      if (selectedRadius !== 'all' && place.distanceKm > radiusLimitKm) {
        return false;
      }

      // Open now filter
      if (openNowOnly && !place.isOpenNow) {
        return false;
      }

      // Delivery filter
      if (deliveryOnly && !place.deliveryAvailable) {
        return false;
      }

      // Spice level filter
      if (selectedSpice !== 'all' && place.spiceLevel !== selectedSpice) {
        return false;
      }

      // Dietary tags
      if (selectedDietary.length > 0) {
        const hasAllTags = selectedDietary.every((t) => place.dietaryTags.includes(t));
        if (!hasAllTags) return false;
      }

      // Certification filter
      if (selectedCert !== 'all') {
        if (!place.halalStatus.certificationBody.toLowerCase().includes(selectedCert.toLowerCase())) {
          return false;
        }
      }

      // Cuisine filter
      if (selectedCuisine !== 'All Cuisines') {
        if (place.cuisine !== selectedCuisine) {
          return false;
        }
      }

      // Alcohol Free filter
      if (alcoholFreeOnly && !place.halalStatus.noAlcoholServed) {
        return false;
      }

      // Prayer Room filter
      if (prayerRoomOnly && !place.halalStatus.hasPrayerRoom) {
        return false;
      }

      return true;
    });
  }, [
    restaurantsWithComputedDistance,
    searchQuery,
    selectedRadius,
    radiusLimitKm,
    openNowOnly,
    deliveryOnly,
    selectedSpice,
    selectedDietary,
    selectedCert,
    selectedCuisine,
    alcoholFreeOnly,
    prayerRoomOnly,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSpice !== 'all') count++;
    if (selectedDietary.length > 0) count += selectedDietary.length;
    if (selectedCert !== 'all') count++;
    if (selectedCuisine !== 'All Cuisines') count++;
    if (openNowOnly) count++;
    if (deliveryOnly) count++;
    if (alcoholFreeOnly) count++;
    if (prayerRoomOnly) count++;
    if (selectedRadius !== 'all') count++;
    return count;
  }, [
    selectedSpice,
    selectedDietary,
    selectedCert,
    selectedCuisine,
    openNowOnly,
    deliveryOnly,
    alcoholFreeOnly,
    prayerRoomOnly,
    selectedRadius,
  ]);

  const handleResetFilters = () => {
    setSelectedSpice('all');
    setSelectedDietary([]);
    setSelectedCert('all');
    setSelectedCuisine('All Cuisines');
    setOpenNowOnly(false);
    setDeliveryOnly(false);
    setAlcoholFreeOnly(false);
    setPrayerRoomOnly(false);
    setSelectedRadius('all');
    setSearchQuery('');
  };

  const handleSelectSimulatedLocation = (loc: any) => {
    setCurrentLocation(loc);
  };

  const handleQuickKeywordClick = (kw: string) => {
    setSearchQuery(kw);
    // If the keyword contains distance specifications, set radius automatically
    if (kw.includes('within 400m')) setSelectedRadius('400m');
    else if (kw.includes('within 0.2 mi')) setSelectedRadius('0.2mi');
    else if (kw.includes('within 0.5 mi')) setSelectedRadius('0.5mi');
    else if (kw.includes('within 1 mi')) setSelectedRadius('1mi');
    else if (kw.includes('within 5 mi')) setSelectedRadius('5mi');
    else if (kw.includes('within 10 mi')) setSelectedRadius('10mi');

    if (kw.includes('open now')) setOpenNowOnly(true);
    if (kw.includes('delivery')) setDeliveryOnly(true);

    // Switch simulated GPS to relevant city if mentioned
    if (kw.toLowerCase().includes('toa payoh') || kw.toLowerCase().includes('orchard') || kw.toLowerCase().includes('novena')) {
      setCurrentLocation(SIMULATED_LOCATIONS[0]);
    } else if (kw.toLowerCase().includes('busan') || kw.toLowerCase().includes('haeundae')) {
      setCurrentLocation(SIMULATED_LOCATIONS[1]);
    } else if (kw.toLowerCase().includes('seoul') || kw.toLowerCase().includes('korea')) {
      setCurrentLocation(SIMULATED_LOCATIONS[2]);
    } else if (kw.toLowerCase().includes('krabi') || kw.toLowerCase().includes('ao nang')) {
      setCurrentLocation(SIMULATED_LOCATIONS[3]);
    } else if (kw.toLowerCase().includes('bangkok') || kw.toLowerCase().includes('ratchathewi')) {
      setCurrentLocation(SIMULATED_LOCATIONS[4]);
    } else if (kw.toLowerCase().includes('bahawalpur')) {
      setCurrentLocation(SIMULATED_LOCATIONS[8]);
    } else if (kw.toLowerCase().includes('delhi')) {
      setCurrentLocation(SIMULATED_LOCATIONS[9]);
    }
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    switch (currentRoute.type) {
      case 'country': {
        const country =
          COUNTRIES_DATA.find((c) => c.code.toLowerCase() === currentRoute.countryCode.toLowerCase()) ||
          COUNTRIES_DATA[0];
        return (
          <CountryPage
            country={country}
            restaurants={restaurantsWithComputedDistance}
            onSelectRestaurant={(r) => setSelectedModalRestaurant(r)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onRouteChange={setCurrentRoute}
          />
        );
      }

      case 'city': {
        const cityHub =
          CITIES_DATA.find((c) => c.slug === currentRoute.citySlug) || CITIES_DATA[0];
        return (
          <CityHubPage
            cityHub={cityHub}
            restaurants={restaurantsWithComputedDistance}
            onSelectRestaurant={(r) => setSelectedModalRestaurant(r)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onRouteChange={setCurrentRoute}
          />
        );
      }

      case 'blog': {
        return (
          <BlogPage
            currentBlogSlug={currentRoute.blogSlug}
            onRouteChange={setCurrentRoute}
          />
        );
      }

      case 'forum':
      case 'forumThread': {
        return (
          <ForumPage
            threads={forumThreads}
            onUpvoteThread={handleUpvoteThread}
            onAddThread={handleAddThread}
            onAddReply={handleAddReply}
            onRouteChange={setCurrentRoute}
          />
        );
      }

      case 'certifications': {
        return <CertificationsPage onRouteChange={setCurrentRoute} />;
      }

      case 'favorites': {
        return (
          <FavoritesPage
            favorites={favorites}
            restaurants={restaurantsWithComputedDistance}
            onToggleFavorite={handleToggleFavorite}
            onSelectRestaurant={(r) => setSelectedModalRestaurant(r)}
            onRouteChange={setCurrentRoute}
          />
        );
      }

      case 'map': {
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-stone-900 font-display">
                  Live Radar & Distance Radii Map Explorer
                </h1>
                <p className="text-xs text-stone-500">
                  Visual pins plotted relative to your active GPS pin ({currentLocation.name}).
                </p>
              </div>
              <button
                onClick={() => setCurrentRoute({ type: 'home' })}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Switch to Directory List View
              </button>
            </div>

            <MapView
              restaurants={filteredRestaurants}
              currentLocationName={currentLocation.name}
              userCoords={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              onSelectRestaurant={(r) => setSelectedModalRestaurant(r)}
              onSelectLocationPin={(locName) => {
                const found = SIMULATED_LOCATIONS.find((l) => l.name === locName);
                if (found) setCurrentLocation(found);
              }}
            />
          </div>
        );
      }

      case 'home':
      default: {
        return (
          <>
            {/* Hero Search Module */}
            <HeroSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRadius={selectedRadius}
              onRadiusChange={setSelectedRadius}
              openNowOnly={openNowOnly}
              onToggleOpenNow={() => setOpenNowOnly(!openNowOnly)}
              deliveryOnly={deliveryOnly}
              onToggleDelivery={() => setDeliveryOnly(!deliveryOnly)}
              currentLocationName={currentLocation.name}
              onSelectSimulatedLocation={handleSelectSimulatedLocation}
              onQuickKeywordClick={handleQuickKeywordClick}
            />

            {/* Filters Bar */}
            <FiltersBar
              selectedSpice={selectedSpice}
              onSelectSpice={setSelectedSpice}
              selectedDietary={selectedDietary}
              onToggleDietary={(tag) =>
                setSelectedDietary((prev) =>
                  prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                )
              }
              selectedCert={selectedCert}
              onSelectCert={setSelectedCert}
              selectedCuisine={selectedCuisine}
              onSelectCuisine={setSelectedCuisine}
              alcoholFreeOnly={alcoholFreeOnly}
              onToggleAlcoholFree={() => setAlcoholFreeOnly(!alcoholFreeOnly)}
              prayerRoomOnly={prayerRoomOnly}
              onTogglePrayerRoom={() => setPrayerRoomOnly(!prayerRoomOnly)}
              onResetFilters={handleResetFilters}
              activeCount={activeFiltersCount}
            />

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              
              {/* Explorer Header Status Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Verified Halal Food Near You'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Showing <strong className="text-stone-900">{filteredRestaurants.length}</strong> matching places sorted by distance from {currentLocation.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setCurrentRoute({ type: 'map' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-stone-600" />
                    <span>View Map Radar</span>
                  </button>
                  <button
                    onClick={() => setCurrentRoute({ type: 'certifications' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg font-semibold transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Halal Checkers</span>
                  </button>
                </div>
              </div>

              {/* Restaurant Cards Grid */}
              {filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onSelect={(r) => setSelectedModalRestaurant(r)}
                      isFavorite={favorites.includes(restaurant.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                  <UtensilsCrossed className="w-10 h-10 text-stone-400 mx-auto" />
                  <h3 className="text-lg font-bold text-stone-800">No restaurants match your filters</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Try switching your distance radius (e.g. to "10 mi" or "All"), clearing strict dietary requirements, or switching your simulated GPS city above.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Popular Destination Hubs Banner Row */}
              <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 overflow-hidden relative shadow-md">
                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                    Featured Country Pages & District Enclaves
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Traveling to South Korea, Thailand, Singapore or the UK?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Access deep-dive local guides: Korean convenience store survival codes, Krabi Ao Nang seafood trails, Singapore MUIS hubs, and Bahawalpur mutton karahi menus.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium">
                    <button
                      onClick={() => setCurrentRoute({ type: 'country', countryCode: 'south-korea' })}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    >
                      🇰🇷 South Korea Guide
                    </button>
                    <button
                      onClick={() => setCurrentRoute({ type: 'country', countryCode: 'thailand' })}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    >
                      🇹🇭 Thailand Halal Hub
                    </button>
                    <button
                      onClick={() => setCurrentRoute({ type: 'country', countryCode: 'singapore' })}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    >
                      🇸🇬 Singapore MUIS Trail
                    </button>
                    <button
                      onClick={() => setCurrentRoute({ type: 'country', countryCode: 'pakistan' })}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                    >
                      🇵🇰 Bahawalpur Food Points
                    </button>
                  </div>
                </div>
              </div>

            </main>
          </>
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans antialiased text-stone-900">
      
      {/* Top Bar Header */}
      <Header
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        favoritesCount={favorites.length}
        currentCityName={currentLocation.city}
      />

      {/* Main Viewport Content */}
      <div className="flex-1">
        {renderCurrentView()}
      </div>

      {/* Restaurant Detail Modal */}
      {selectedModalRestaurant && (
        <RestaurantModal
          restaurant={selectedModalRestaurant}
          onClose={() => setSelectedModalRestaurant(null)}
          isFavorite={favorites.includes(selectedModalRestaurant.id)}
          onToggleFavorite={handleToggleFavorite}
          onAddReview={handleAddReview}
        />
      )}

      {/* Footer Directory (35+ Pages & SEO Keywords) */}
      <Footer
        onRouteChange={setCurrentRoute}
        onKeywordSearch={(kw) => {
          handleQuickKeywordClick(kw);
          setCurrentRoute({ type: 'home' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
