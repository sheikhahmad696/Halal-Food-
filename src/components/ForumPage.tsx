import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, CheckCircle, Tag, Plus, Search, UserCheck, ArrowLeft, Send } from 'lucide-react';
import { ForumThread, PageRoute } from '../types';

interface ForumPageProps {
  threads: ForumThread[];
  onUpvoteThread: (threadId: string) => void;
  onAddThread: (newThread: ForumThread) => void;
  onAddReply: (threadId: string, replyText: string, authorName: string) => void;
  onRouteChange: (route: PageRoute) => void;
}

export const ForumPage: React.FC<ForumPageProps> = ({
  threads,
  onUpvoteThread,
  onAddThread,
  onAddReply,
  onRouteChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [forumSearch, setForumSearch] = useState<string>('');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState<boolean>(false);

  // New Thread Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Fast Food Chains & Verification');
  const [newAuthor, setNewAuthor] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTags, setNewTags] = useState('');

  // Reply Form state
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');

  const categories = [
    { label: 'All Discussions', value: 'all' },
    { label: 'Fast Food Chains & Verification', value: 'Fast Food Chains & Verification' },
    { label: 'Thailand & Southeast Asia', value: 'Thailand & Southeast Asia' },
    { label: 'Pakistan & Royal Punjab', value: 'Pakistan & Royal Punjab' },
    { label: 'Canada & North America', value: 'Canada & North America' },
    { label: 'UK & Europe Certifications', value: 'UK & Europe Certifications' },
    { label: 'South Korea & East Asia', value: 'South Korea & East Asia' },
  ];

  const filteredThreads = threads.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchQuery =
      !forumSearch ||
      t.title.toLowerCase().includes(forumSearch.toLowerCase()) ||
      t.body.toLowerCase().includes(forumSearch.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(forumSearch.toLowerCase()));
    return matchCat && matchQuery;
  });

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim() || !newAuthor.trim()) return;

    const thread: ForumThread = {
      id: `thread-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      author: newAuthor.trim(),
      authorBadge: 'Community Member',
      date: 'Just now',
      repliesCount: 0,
      viewsCount: 1,
      upvotes: 1,
      isSolved: false,
      body: newBody.trim(),
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      replies: [],
    };

    onAddThread(thread);
    setShowNewThreadModal(false);
    setNewTitle('');
    setNewAuthor('');
    setNewBody('');
    setNewTags('');
    setActiveThreadId(thread.id);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadId || !replyText.trim()) return;
    onAddReply(activeThreadId, replyText.trim(), replyAuthor.trim() || 'Verified Diner');
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRouteChange({ type: 'home' })}
              className="hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Global Directory
            </button>
            <span>/</span>
            <span className="font-semibold text-stone-900">Community Forum</span>
          </div>

          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ask a Question</span>
          </button>
        </div>

        {/* Forum Header Banner */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
              Global Muslim Community Q&A & Halal Food Trails
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
              Vibrant Halal Community Forum
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed">
              Ask fellow Muslim travelers and local residents about KFC halal status, hidden Korean convenience store items, Ao Nang tomyam spots, or Bahawalpur food point rates.
            </p>
          </div>

          {/* Search bar & Category filters */}
          <div className="mt-5 pt-5 border-t border-stone-100 space-y-3">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search forum topics, keywords, cities..."
                value={forumSearch}
                onChange={(e) => setForumSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                    selectedCategory === c.value
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Thread Detail View if a thread is active */}
        {activeThread ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <button
              onClick={() => setActiveThreadId(null)}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-2 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to all threads
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold mb-2">
                <span>{activeThread.category}</span>
                <span>·</span>
                <span className="text-stone-500">Posted by {activeThread.author}</span>
                <span>·</span>
                <span className="text-stone-500">{activeThread.date}</span>
                {activeThread.isSolved && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" /> Solved
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display mb-3">
                {activeThread.title}
              </h2>

              <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-200">
                {activeThread.body}
              </p>

              <div className="flex items-center gap-2 mt-3">
                {activeThread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Replies List */}
            <div className="pt-6 border-t border-stone-200 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Responses ({activeThread.replies.length})
              </h3>

              {activeThread.replies.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-stone-800 text-white font-bold text-xs flex items-center justify-center">
                        {rep.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900">{rep.author}</span>
                        {rep.authorLocation && (
                          <span className="text-[10px] text-stone-500 block">
                            {rep.authorLocation}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-400">{rep.date}</span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed pl-9">
                    {rep.content}
                  </p>

                  <div className="flex items-center justify-end gap-1 text-[11px] text-stone-500 pt-1">
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />
                    <span>{rep.upvotes} found this helpful</span>
                  </div>
                </div>
              ))}

              {/* Submit Reply Box */}
              <form onSubmit={handleSendReply} className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Local Foodie)"
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-stone-300 w-48 bg-white"
                  />
                  <span className="text-[11px] text-stone-400">Leave reply as verified community answer</span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide restaurant advice, certification details, or helpful tips..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Post Reply
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Threads List */
          <div className="space-y-3">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-amber-700">{thread.category}</span>
                    <span>·</span>
                    <span>By {thread.author}</span>
                    <span>·</span>
                    <span>{thread.date}</span>
                    {thread.isSolved && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Solved
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 font-display">
                    {thread.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {thread.body}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 text-xs text-stone-500 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpvoteThread(thread.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 transition-colors font-medium text-stone-700"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{thread.upvotes}</span>
                  </button>

                  <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
                    <MessageSquare className="w-3 h-3" />
                    <span>{thread.replies.length} replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Ask a Question */}
        {showNewThreadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-stone-200 max-w-xl w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-stone-900 font-display mb-1">
                Ask the Halal Community
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Ask about restaurant certifications, local dish spice levels, or fast food verification.
              </p>

              <form onSubmit={handleCreateThread} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan UK"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Topic Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    {categories.filter((c) => c.value !== 'all').map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Question Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Is Korean McDonald's beef halal or only fish burgers?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Detailed Explanation</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide neighborhood details, specific concerns, or dietary requests..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Seoul, McDonald's, KMF"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewThreadModal(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800"
                  >
                    Publish Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
