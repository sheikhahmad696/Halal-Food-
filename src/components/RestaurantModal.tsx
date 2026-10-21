import React, { useState } from 'react';
import { X, Star, MapPin, Phone, Globe, ShieldCheck, Flame, Bookmark, Clock, CheckCircle2, MessageSquare, Plus, Share2 } from 'lucide-react';
import { Restaurant, UserReview, SpiceLevel } from '../types';

interface RestaurantModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddReview: (restaurantId: string, review: UserReview) => void;
}

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  restaurant,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddReview,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSpice, setReviewSpice] = useState<SpiceLevel>(3);
  const [reviewComment, setReviewComment] = useState('');
  const [recommendedDish, setRecommendedDish] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      avatar: reviewAuthor.substring(0, 2).toUpperCase(),
      verifiedDiner: true,
      rating: reviewRating,
      spiceRating: reviewSpice,
      date: 'Just now',
      comment: reviewComment.trim(),
      recommendedDishes: recommendedDish.trim() ? [recommendedDish.trim()] : [],
      helpfulCount: 1,
    };

    onAddReview(restaurant.id, newRev);
    setShowReviewForm(false);
    setReviewAuthor('');
    setReviewComment('');
    setRecommendedDish('');
  };

  const getSpiceBadge = (level: SpiceLevel) => {
    switch (level) {
      case 0: return { label: 'No Spice', icon: '⚪', color: 'text-stone-500 bg-stone-100' };
      case 1: return { label: 'Mild (1/5)', icon: '🌶️', color: 'text-amber-700 bg-amber-50' };
      case 2: return { label: 'Medium (2/5)', icon: '🌶️🌶️', color: 'text-orange-700 bg-orange-50' };
      case 3: return { label: 'Hot (3/5)', icon: '🌶️🌶️🌶️', color: 'text-rose-700 bg-rose-50' };
      case 4: return { label: 'Extra Hot (4/5)', icon: '🔥', color: 'text-red-700 bg-red-100' };
      case 5: return { label: 'Ghost Pepper (5/5)', icon: '💀🔥', color: 'text-purple-800 bg-purple-100' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="relative h-60 w-full bg-stone-900 shrink-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover brightness-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 flex items-center justify-center transition-all"
              title="Share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => onToggleFavorite(restaurant.id, e)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isFavorite ? 'bg-amber-500 text-stone-950' : 'bg-stone-900/80 text-white hover:bg-stone-900'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 flex items-center justify-center transition-all"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {copiedLink && (
            <div className="absolute top-16 right-4 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-md shadow-md animate-fade-in">
              Link copied to clipboard!
            </div>
          )}

          {/* Title & Location Header Inside Scrim */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <span>{restaurant.cuisine}</span>
              <span>·</span>
              <span>{restaurant.neighborhood}, {restaurant.city}</span>
              <span>·</span>
              <span className="font-mono text-white">{restaurant.priceRange}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              {restaurant.name}
            </h2>
            {restaurant.nativeName && (
              <p className="text-sm text-stone-300 font-medium">{restaurant.nativeName}</p>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Clock className="w-4 h-4 text-stone-500 shrink-0" />
              <span>{restaurant.isOpenNow ? 'Open Now' : 'Closed'} · {restaurant.openingHours}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Phone className="w-4 h-4 text-stone-500 shrink-0" />
              <span>{restaurant.phone}</span>
            </div>
          </div>

          {/* Halal Certification & Verification Proof Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-emerald-950 font-display">
                  Official Halal Certification Verification
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {restaurant.halalStatus.certificationBody}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
              <div>
                <span className="font-semibold text-stone-900 block">Meat Sourcing & Slaughter:</span>
                <span>{restaurant.halalStatus.halalMeatSource}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-900 block">Inspection & Validity:</span>
                <span>Verified Active · Audit Date: {restaurant.halalStatus.verificationDate}</span>
                {restaurant.halalStatus.certificateNumber && (
                  <span className="block font-mono text-[11px] text-stone-500 mt-0.5">
                    Ref ID: {restaurant.halalStatus.certificateNumber}
                  </span>
                )}
              </div>
              <div>
                <span className="font-semibold text-stone-900 block">Alcohol Policy:</span>
                <span className={restaurant.halalStatus.noAlcoholServed ? 'text-emerald-800 font-medium' : 'text-stone-700'}>
                  {restaurant.halalStatus.noAlcoholServed ? '✓ 100% Alcohol-Free Premises' : 'Segregated Halal Kitchen & Cutlery'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-stone-900 block">Prayer Facilities:</span>
                <span>{restaurant.halalStatus.hasPrayerRoom ? '✓ Dedicated Prayer Room / Musalla on-site' : 'No prayer room on-site (nearby mosque available)'}</span>
              </div>
            </div>
          </div>

          {/* Food Menu & Specific Spice Levels Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  Featured Halal Dishes & Specific Spice Levels
                </h3>
                <p className="text-xs text-stone-500">
                  Every item is individually labeled with heat grade and dietary suitability.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {restaurant.featuredFoods.map((dish) => {
                const spice = getSpiceBadge(dish.spiceLevel);
                return (
                  <div
                    key={dish.name}
                    className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">
                            {dish.name}
                          </h4>
                          {dish.nativeName && (
                            <span className="text-xs text-stone-500 font-medium block">
                              {dish.nativeName}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-bold text-stone-900 text-sm shrink-0">
                          {dish.price}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                      {/* Spice Indicator */}
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 ${spice.color}`}>
                        <Flame className="w-3 h-3" />
                        <span>{spice.label}</span>
                      </span>

                      {/* Dietary notes */}
                      <div className="flex items-center gap-1 text-[11px] text-stone-500">
                        {dish.dietary.map((d) => (
                          <span key={d} className="bg-stone-100 px-1.5 py-0.5 rounded">
                            {d.replace(' Friendly', '').replace(' Options', '')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Reviews & Community Rating Section */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
                  <span>Community Reviews</span>
                  <span className="text-xs font-normal text-stone-500">
                    ({restaurant.reviews.length} Verified Diners)
                  </span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-stone-50 p-4 rounded-xl border border-stone-200 mb-5 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Submit Your Verified Experience
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mansoor"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Recommended Dish</label>
                    <input
                      type="text"
                      placeholder="e.g. Mutton Karahi / Tomyam"
                      value={recommendedDish}
                      onChange={(e) => setRecommendedDish(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Rating ({reviewRating} / 5 Stars)
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-stone-400 hover:text-amber-500"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'text-amber-500 fill-amber-500' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Observed Spice Level
                    </label>
                    <select
                      value={reviewSpice}
                      onChange={(e) => setReviewSpice(Number(e.target.value) as SpiceLevel)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value={0}>0 - No Spice</option>
                      <option value={1}>1 - Mild</option>
                      <option value={2}>2 - Medium</option>
                      <option value={3}>3 - Hot</option>
                      <option value={4}>4 - Extra Hot</option>
                      <option value={5}>5 - Fire / Ghost Pepper</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Review Comments</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe meat tenderness, prayer room cleanliness, staff halal confirmation..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {restaurant.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                        {rev.avatar}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900">{rev.author}</span>
                        {rev.verifiedDiner && (
                          <span className="ml-1.5 text-[10px] text-emerald-700 font-semibold">
                            ✓ Verified Diner
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rev.rating) ? 'fill-current' : 'text-stone-300'}`} />
                      ))}
                    </div>
                    <span className="text-rose-600 font-medium">
                      Spice: {'🌶️'.repeat(Math.max(1, rev.spiceRating))}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.recommendedDishes.length > 0 && (
                    <div className="text-[11px] text-stone-500 pt-1">
                      <span className="font-semibold text-stone-700">Recommended:</span> {rev.recommendedDishes.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-stone-600">
            Coordinates: <span className="font-mono text-stone-800">{restaurant.latitude.toFixed(4)}, {restaurant.longitude.toFixed(4)}</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>
        </div>

      </div>
    </div>
  );
};
