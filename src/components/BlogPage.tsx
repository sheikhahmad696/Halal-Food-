import React, { useState } from 'react';
import { BookOpen, Clock, ChevronDown, ChevronUp, Share2, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { BlogGuide, PageRoute } from '../types';
import { BLOGS_DATA } from '../data/blogs';

interface BlogPageProps {
  currentBlogSlug: string;
  onRouteChange: (route: PageRoute) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  currentBlogSlug,
  onRouteChange,
}) => {
  const currentBlog = BLOGS_DATA.find((b) => b.slug === currentBlogSlug) || BLOGS_DATA[0];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRouteChange({ type: 'home' })}
              className="hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
            </button>
            <span>/</span>
            <span>Expert Halal Food Guides</span>
            <span>/</span>
            <span className="font-semibold text-stone-900 truncate max-w-xs">{currentBlog.title}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-md hover:bg-stone-100 text-stone-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link!' : 'Share Article'}</span>
          </button>
        </div>

        {/* Horizontal Article Selector Strip (8 Articles) */}
        <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-stone-500 whitespace-nowrap pl-1">
              Select Guide:
            </span>
            {BLOGS_DATA.map((blog) => (
              <button
                key={blog.slug}
                onClick={() => onRouteChange({ type: 'blog', blogSlug: blog.slug })}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 text-left ${
                  blog.slug === currentBlog.slug
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                }`}
              >
                {blog.title.split('?')[0].split(':')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Main Article Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Prose Body (8 cols) */}
          <article className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs p-6 sm:p-10 space-y-6">
            
            {/* Metadata Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold mb-2">
                <span className="bg-amber-100 px-2.5 py-0.5 rounded-full">{currentBlog.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-stone-500">
                  <Clock className="w-3 h-3" /> {currentBlog.readTime}
                </span>
                <span>·</span>
                <span className="text-stone-500">{currentBlog.date}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 font-display leading-tight mb-3">
                {currentBlog.title}
              </h1>

              <p className="text-stone-600 text-base leading-relaxed font-medium">
                {currentBlog.subtitle}
              </p>

              <div className="text-xs text-stone-400 mt-3 pt-3 border-t border-stone-100">
                Author: <strong className="text-stone-700">{currentBlog.author}</strong>
              </div>
            </div>

            {/* Featured Article Image */}
            <div className="rounded-xl overflow-hidden h-72 w-full bg-stone-100">
              <img
                src={currentBlog.image}
                alt={currentBlog.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== window.location.origin + '/images/hero_halal_dining_spread.jpg') {
                    target.src = '/images/hero_halal_dining_spread.jpg';
                  }
                }}
              />
            </div>

            {/* Content Sections */}
            <div className="space-y-6 text-stone-800 text-sm sm:text-base leading-relaxed">
              {currentBlog.content.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display pt-2 border-t border-stone-100">
                    {sec.section}
                  </h2>
                  <div className="text-stone-700 whitespace-pre-line leading-relaxed">
                    {sec.body}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Accordion Section */}
            {currentBlog.faq.length > 0 && (
              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-stone-900 font-display">
                    Frequently Asked Questions (FAQ)
                  </h3>
                </div>

                <div className="space-y-3">
                  {currentBlog.faq.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full text-left p-4 flex items-center justify-between gap-3 text-stone-900 font-semibold text-sm hover:bg-stone-100/60 transition-colors"
                        >
                          <span>{item.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="p-4 pt-1 text-stone-700 text-sm leading-relaxed border-t border-stone-200 bg-white">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Structured Data Verification Stamp */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Verified against Islamic Jurisprudence & Official Halal Certification Bodies (KMF, CICOT, HMC, HMA, MUIS).
                </span>
              </div>
            </div>

          </article>

          {/* Right Sidebar: Quick Search Queries & Related Guides (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Search Keywords Box */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Target Search Keywords in This Guide:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {currentBlog.seoKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Other Guides List */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                All 8 Expert Guides:
              </h3>
              <div className="space-y-3">
                {BLOGS_DATA.map((blog) => (
                  <button
                    key={blog.slug}
                    onClick={() => onRouteChange({ type: 'blog', blogSlug: blog.slug })}
                    className="w-full text-left p-3 rounded-lg border border-stone-100 hover:border-amber-300 hover:bg-amber-50/20 transition-all block group"
                  >
                    <span className="text-[10px] uppercase font-bold text-amber-700 block mb-0.5">
                      {blog.category}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-900 leading-snug">
                      {blog.title}
                    </h4>
                  </button>
                ))}
              </div>
            </div>

            {/* Join Discussion CTA */}
            <div className="bg-stone-900 text-white rounded-xl p-5 shadow-xs">
              <h4 className="text-sm font-bold font-display mb-1 text-white">
                Have questions or updates?
              </h4>
              <p className="text-xs text-stone-300 mb-3">
                Share your personal dining discoveries or ask the local Muslim community.
              </p>
              <button
                onClick={() => onRouteChange({ type: 'forum' })}
                className="w-full py-2 bg-amber-500 text-stone-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors"
              >
                Go to Community Forum
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
