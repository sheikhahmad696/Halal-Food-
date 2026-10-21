import React from 'react';
import { Flame, Check, RotateCcw, ShieldCheck, HeartHandshake } from 'lucide-react';
import { DietaryTag, SpiceLevel } from '../types';

interface FiltersBarProps {
  selectedSpice: SpiceLevel | 'all';
  onSelectSpice: (spice: SpiceLevel | 'all') => void;
  selectedDietary: DietaryTag[];
  onToggleDietary: (tag: DietaryTag) => void;
  selectedCert: string;
  onSelectCert: (cert: string) => void;
  selectedCuisine: string;
  onSelectCuisine: (cuisine: string) => void;
  alcoholFreeOnly: boolean;
  onToggleAlcoholFree: () => void;
  prayerRoomOnly: boolean;
  onTogglePrayerRoom: () => void;
  onResetFilters: () => void;
  activeCount: number;
}

const DIETARY_OPTIONS: DietaryTag[] = [
  'Gluten-Free Options',
  'Dairy-Free',
  'Vegan Friendly',
  'Vegetarian Friendly',
  'Nut-Free Kitchen',
  'Keto Friendly',
];

const CERT_OPTIONS = [
  { label: 'All Certifications', value: 'all' },
  { label: 'MUIS Certified (Singapore)', value: 'MUIS' },
  { label: 'KMF Halal (South Korea)', value: 'KMF' },
  { label: 'CICOT Halal (Thailand)', value: 'CICOT' },
  { label: 'HMC Stun-Free (UK)', value: 'HMC' },
  { label: 'HMA Canada Verified', value: 'HMA' },
  { label: 'HFSAA Zabiha (USA)', value: 'HFSAA' },
  { label: 'JAKIM Certified (Malaysia)', value: 'JAKIM' },
  { label: '100% Muslim Owned', value: 'Muslim Owned' },
];

const CUISINE_OPTIONS = [
  'All Cuisines',
  'Traditional Korean / Bulgogi / Dakdoritang',
  'Southern Thai Muslim & Seafood',
  'Traditional Pakistani / Royal Bahawalpur Karahi & BBQ',
  'Singaporean / Traditional Malay',
  'American Halal Street Food / Gyro & Platters',
  'Middle Eastern / Lebanese Halal Grills',
  'Royal Mughlai / Mutton Korma & Nihari',
  'Halal Italian / Gourmet Steakhouse',
];

export const FiltersBar: React.FC<FiltersBarProps> = ({
  selectedSpice,
  onSelectSpice,
  selectedDietary,
  onToggleDietary,
  selectedCert,
  onSelectCert,
  selectedCuisine,
  onSelectCuisine,
  alcoholFreeOnly,
  onToggleAlcoholFree,
  prayerRoomOnly,
  onTogglePrayerRoom,
  onResetFilters,
  activeCount,
}) => {
  return (
    <div className="bg-white border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Top Row: Spice Meter & Cuisine & Certs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Spice Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              Spice Level:
            </span>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => onSelectSpice('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedSpice === 'all'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All
              </button>
              {[
                { level: 0, label: '0 No Spice', icon: '⚪' },
                { level: 1, label: '1 Mild', icon: '🌶️' },
                { level: 2, label: '2 Medium', icon: '🌶️🌶️' },
                { level: 3, label: '3 Hot', icon: '🌶️🌶️🌶️' },
                { level: 4, label: '4 Extra Hot', icon: '🔥' },
                { level: 5, label: '5 Ghost', icon: '💀' },
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => onSelectSpice(s.level as SpiceLevel)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                    selectedSpice === s.level
                      ? 'bg-rose-500 text-white shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title={s.label}
                >
                  <span>{s.level === 0 ? '0' : `Lv${s.level}`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Select Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-700">Cuisine:</span>
            <select
              value={selectedCuisine}
              onChange={(e) => onSelectCuisine(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 max-w-[200px] truncate"
            >
              {CUISINE_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Certification Authority Select Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Halal Verification:
            </span>
            <select
              value={selectedCert}
              onChange={(e) => onSelectCert(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              {CERT_OPTIONS.map((cert) => (
                <option key={cert.value} value={cert.value}>{cert.label}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-800 py-1 px-2 rounded-md hover:bg-rose-50 transition-colors ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters ({activeCount})
            </button>
          )}
        </div>

        {/* Second Row: Dietary Filter Chips & Facility Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-500 mr-1">Diet & Amenities:</span>
          
          {DIETARY_OPTIONS.map((diet) => {
            const isSelected = selectedDietary.includes(diet);
            return (
              <button
                key={diet}
                type="button"
                onClick={() => onToggleDietary(diet)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{diet}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onToggleAlcoholFree}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              alcoholFreeOnly
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Alcohol-Free Only
          </button>

          <button
            type="button"
            onClick={onTogglePrayerRoom}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              prayerRoomOnly
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Prayer Room / Musalla Available
          </button>
        </div>

      </div>
    </div>
  );
};
