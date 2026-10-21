import React from 'react';
import { Bookmark, Compass, Globe, MessageSquare, BookOpen, ShieldCheck, MapPin } from 'lucide-react';
import { PageRoute } from '../types';

interface HeaderProps {
  currentRoute: PageRoute;
  onRouteChange: (route: PageRoute) => void;
  favoritesCount: number;
  currentCityName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onRouteChange,
  favoritesCount,
  currentCityName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Strict Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Text Element Wordmark */}
        <button
          onClick={() => onRouteChange({ type: 'home' })}
          className="flex items-center gap-2.5 text-left group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-stone-800 transition-colors">
            H
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-stone-900 font-display">
              HalalAtlas
            </div>
            <div className="text-[10px] text-stone-500 font-medium tracking-wider -mt-1 hidden sm:block">
              GLOBAL HALAL FINDER
            </div>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onRouteChange({ type: 'home' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentRoute.type === 'home' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Near Me Finder
          </button>

          <button
            onClick={() => onRouteChange({ type: 'map' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentRoute.type === 'map' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Interactive Map
          </button>

          <button
            onClick={() => onRouteChange({ type: 'country', countryCode: 'singapore' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentRoute.type === 'country' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Countries & Hubs
          </button>

          <button
            onClick={() => onRouteChange({ type: 'blog', blogSlug: 'is-korean-kfc-halal-guide' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentRoute.type === 'blog' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Guides & Fast Food Truth
          </button>

          <button
            onClick={() => onRouteChange({ type: 'forum' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentRoute.type === 'forum' || currentRoute.type === 'forumThread' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Community Forum
          </button>

          <button
            onClick={() => onRouteChange({ type: 'certifications' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentRoute.type === 'certifications' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Certifications Checker
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Personalized Saved / Profile) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs text-stone-600 bg-stone-100 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium truncate max-w-[110px]">{currentCityName}</span>
          </div>

          <button
            onClick={() => onRouteChange({ type: 'favorites' })}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentRoute.type === 'favorites'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Saved ({favoritesCount})</span>
          </button>
        </div>
      </div>

      {/* Sub-bar for mobile navigation */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-stone-200 bg-stone-50 overflow-x-auto text-xs font-medium text-stone-600 gap-4">
        <button
          onClick={() => onRouteChange({ type: 'home' })}
          className={`whitespace-nowrap shrink-0 ${currentRoute.type === 'home' ? 'text-stone-950 font-bold' : ''}`}
        >
          Near Me
        </button>
        <button
          onClick={() => onRouteChange({ type: 'map' })}
          className={`whitespace-nowrap shrink-0 ${currentRoute.type === 'map' ? 'text-stone-950 font-bold' : ''}`}
        >
          Live Map
        </button>
        <button
          onClick={() => onRouteChange({ type: 'country', countryCode: 'singapore' })}
          className={`whitespace-nowrap shrink-0 ${currentRoute.type === 'country' ? 'text-stone-950 font-bold' : ''}`}
        >
          Countries
        </button>
        <button
          onClick={() => onRouteChange({ type: 'blog', blogSlug: 'is-korean-kfc-halal-guide' })}
          className={`whitespace-nowrap shrink-0 ${currentRoute.type === 'blog' ? 'text-stone-950 font-bold' : ''}`}
        >
          Guides
        </button>
        <button
          onClick={() => onRouteChange({ type: 'forum' })}
          className={`whitespace-nowrap shrink-0 ${currentRoute.type === 'forum' ? 'text-stone-950 font-bold' : ''}`}
        >
          Forum
        </button>
        <button
          onClick={() => onRouteChange({ type: 'certifications' })}
          className={`whitespace-nowrap shrink-0 ${currentRoute.type === 'certifications' ? 'text-stone-950 font-bold' : ''}`}
        >
          Cert Checker
        </button>
      </div>
    </header>
  );
};
