export type SpiceLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type DietaryTag = 
  | 'Gluten-Free Options'
  | 'Dairy-Free'
  | 'Vegan Friendly'
  | 'Vegetarian Friendly'
  | 'Nut-Free Kitchen'
  | 'Keto Friendly'
  | 'Low Carb';

export interface HalalCertification {
  certificationBody: string; // e.g. "MUIS Singapore Certified", "KMF Korea Halal", "HMC Certified", "CICOT Thailand", "HMA Canada", "JAKIM Malaysia"
  isVerified: boolean;
  verificationDate: string;
  certificateNumber?: string;
  noAlcoholServed: boolean;
  hasPrayerRoom: boolean;
  halalMeatSource: string;
  porkFreeFacility: boolean;
}

export interface MenuItem {
  name: string;
  nativeName?: string;
  description: string;
  price: string;
  spiceLevel: SpiceLevel;
  dietary: DietaryTag[];
  isSignature?: boolean;
}

export interface UserReview {
  id: string;
  author: string;
  avatar: string;
  verifiedDiner: boolean;
  rating: number;
  spiceRating: SpiceLevel;
  date: string;
  comment: string;
  recommendedDishes: string[];
  helpfulCount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  nativeName?: string;
  slug: string;
  cuisine: string;
  country: string; // 'singapore' | 'south-korea' | 'thailand' | 'canada' | 'uk' | 'usa' | 'pakistan' | 'india' | 'malaysia' | 'australia'
  countryName: string;
  city: string;
  neighborhood: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number; // distance relative to current active GPS pin
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  isOpenNow: boolean;
  openingHours: string;
  deliveryAvailable: boolean;
  phone: string;
  website?: string;
  image: string;
  spiceLevel: SpiceLevel;
  halalStatus: HalalCertification;
  dietaryTags: DietaryTag[];
  featuredFoods: MenuItem[];
  keywords: string[];
  reviews: UserReview[];
}

export interface CountryHub {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  heroImage: string;
  description: string;
  certificationAuthority: string;
  certBadge: string;
  popularCuisines: string[];
  keyCities: string[];
  seoKeywords: string[];
}

export interface CityHub {
  slug: string;
  name: string;
  nativeName?: string;
  countryCode: string;
  countryName: string;
  headline: string;
  description: string;
  popularAreas: string[];
  topCuisines: string[];
  seoQuery: string;
  heroImage?: string;
}

export interface BlogGuide {
  slug: string;
  title: string;
  subtitle: string;
  category: 'Fast Food Verification' | 'Travel Guides' | 'Food Trail' | 'Certification 101';
  readTime: string;
  date: string;
  author: string;
  image: string;
  seoKeywords: string[];
  content: { section: string; body: string }[];
  faq: { question: string; answer: string }[];
}

export interface ForumReply {
  id: string;
  author: string;
  authorLocation?: string;
  verified: boolean;
  date: string;
  content: string;
  upvotes: number;
}

export interface ForumThread {
  id: string;
  title: string;
  category: string;
  author: string;
  authorBadge: string;
  date: string;
  repliesCount: number;
  viewsCount: number;
  upvotes: number;
  isSolved: boolean;
  body: string;
  tags: string[];
  replies: ForumReply[];
}

export type PageRoute = 
  | { type: 'home' }
  | { type: 'map' }
  | { type: 'country'; countryCode: string }
  | { type: 'city'; citySlug: string }
  | { type: 'blog'; blogSlug: string }
  | { type: 'forum' }
  | { type: 'forumThread'; threadId: string }
  | { type: 'certifications' }
  | { type: 'favorites' }
  | { type: 'search'; query: string };
