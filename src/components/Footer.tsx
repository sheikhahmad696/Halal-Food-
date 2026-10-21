import React from 'react';
import { Compass, ShieldCheck, Heart, MapPin } from 'lucide-react';
import { PageRoute } from '../types';
import { COUNTRIES_DATA } from '../data/countries';
import { CITIES_DATA } from '../data/cities';
import { BLOGS_DATA } from '../data/blogs';
import { FORUM_THREADS } from '../data/forum';

interface FooterProps {
  onRouteChange: (route: PageRoute) => void;
  onKeywordSearch: (keyword: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onRouteChange, onKeywordSearch }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Brand & Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-800">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 font-bold text-base flex items-center justify-center font-display">
                H
              </div>
              <span className="text-xl font-bold text-white font-display">HalalAtlas</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Global Halal food exploration engine with real distance radiuses (400m to 10 mi), dish-by-dish spice meters, dietary filters, and independent certification verification across 10 countries and 35+ dedicated destination guides.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-stone-400">
            <button
              onClick={() => onRouteChange({ type: 'certifications' })}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Halal Certification Registry</span>
            </button>
            <button
              onClick={() => onRouteChange({ type: 'forum' })}
              className="hover:text-white transition-colors"
            >
              Community Forum
            </button>
          </div>
        </div>

        {/* 4 Multi-Column Directory (Over 35+ Dedicated Page Links) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: 10 Dedicated Country Pages */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-display uppercase tracking-wider">
              Country Portals
            </h4>
            <ul className="space-y-2 text-stone-400">
              {COUNTRIES_DATA.map((c) => (
                <li key={c.code}>
                  <button
                    onClick={() => onRouteChange({ type: 'country', countryCode: c.code })}
                    className="hover:text-amber-400 transition-colors text-left flex items-center gap-2"
                  >
                    <span>{c.flag}</span>
                    <span>Halal Food in {c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: 12 Neighborhood & District Hubs */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-display uppercase tracking-wider">
              City & District Hubs
            </h4>
            <ul className="space-y-2 text-stone-400">
              {CITIES_DATA.map((hub) => (
                <li key={hub.slug}>
                  <button
                    onClick={() => onRouteChange({ type: 'city', citySlug: hub.slug })}
                    className="hover:text-amber-400 transition-colors text-left line-clamp-1"
                  >
                    {hub.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: 8 In-Depth Blog Guides & Fast Food Truth */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-display uppercase tracking-wider">
              Expert Guides & FAQs
            </h4>
            <ul className="space-y-2 text-stone-400">
              {BLOGS_DATA.map((blog) => (
                <li key={blog.slug}>
                  <button
                    onClick={() => onRouteChange({ type: 'blog', blogSlug: blog.slug })}
                    className="hover:text-amber-400 transition-colors text-left line-clamp-1"
                  >
                    {blog.title.split('?')[0].split(':')[0]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Community Discussions & Certifications */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-display uppercase tracking-wider">
              Community & Standards
            </h4>
            <ul className="space-y-2 text-stone-400">
              {FORUM_THREADS.map((thread) => (
                <li key={thread.id}>
                  <button
                    onClick={() => onRouteChange({ type: 'forum' })}
                    className="hover:text-amber-400 transition-colors text-left line-clamp-1"
                  >
                    {thread.title}
                  </button>
                </li>
              ))}
              <li className="pt-2 border-t border-stone-800">
                <button
                  onClick={() => onRouteChange({ type: 'certifications' })}
                  className="text-amber-400 hover:underline font-semibold"
                >
                  View All Certification Bodies ↗
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Global SEO Search Keywords Index matching user requirements */}
        <div className="pt-8 border-t border-stone-800/80 space-y-3">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Google SEO Index & Real-Time Discovery Queries:
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-stone-400">
            {[
              'Halal food near Toa Payoh',
              'Halal food near Novena',
              'Halal food near Orchard Rd',
              'Halal food near Jurong East',
              'Halal food near Tampines',
              'Halal food in Busan Near me',
              'Halal food Busan Haeundae',
              'Makan halal Korean restaurant Busan',
              'Halal food Seoul',
              'Halal restaurant Jeju',
              'May and Zin restaurant',
              'Best halal food in krabi',
              'Asama Halal Thai food',
              'Bangboo Halal Seafood',
              'usman thai muslim food',
              'halal food near ratchathewi',
              'halal tomyam near me',
              'Is Korean KFC halal?',
              'Is Korea halal friendly?',
              'Is KFC halal in Canada?',
              'Is KFC UK halal or not?',
              'shah\'s halal food near me',
              'restaurants in bahawalpur',
              'bahawalpur food point menu',
              'bahawalpur famous food places',
              'halal restaurants delhi near me',
              'zabiha halal restaurants near me',
              'halal food near me within 400m',
              'halal food near me within 0.2 mi',
              'halal food near me within 0.5 mi',
              'halal food near me within 1 mi',
              'halal food near me within 5 mi',
              'halal food near me within 10 mi',
              'halal food near me open now',
            ].map((kw) => (
              <button
                key={kw}
                onClick={() => onKeywordSearch(kw)}
                className="hover:text-amber-300 hover:underline transition-colors"
              >
                {kw} ·
              </button>
            ))}
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-4">
          <div>
            © {new Date().getFullYear()} HalalAtlas. Dedicated to global Muslim travelers & food lovers.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Verification</span>
            <span>·</span>
            <span>Report Non-Halal Anomaly</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
