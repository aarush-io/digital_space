// src/pages/WhyIDontLikeMyCountry.jsx
//
// Place at: src/pages/WhyIDontLikeMyCountry.jsx
//
// Full page for the news dashboard. See the bottom of this file for the two
// small edits needed in main.jsx to route to this page.

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../components/background/AnimatedBackground";
import Disclaimer from "../components/news/Disclaimer";
import NewsHero from "../components/news/NewsHero";
import SearchBar from "../components/news/SearchBar";
import CategoryFilter from "../components/news/CategoryFilter";
import NewsCard from "../components/news/NewsCard";
import NewsSkeleton from "../components/news/NewsSkeleton";
import { useNews } from "../hooks/useNews";
import { timeAgo } from "../lib/newsCategories";

export default function WhyIDontLikeMyCountry() {
  const { articles, updatedAt, failedCategories, isLoading, error, reload } = useNews();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const counts = useMemo(() => {
    const map = {};
    for (const a of articles) map[a.category] = (map[a.category] || 0) + 1;
    return map;
  }, [articles]);

  const latestHeadlines = useMemo(() => articles.slice(0, 10).map((a) => a.title), [articles]);

  const visibleArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles
      .filter((a) => (activeCategory ? a.category === activeCategory : true))
      .filter((a) =>
        query
          ? a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
          : true
      )
      // newest first
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [articles, activeCategory, search]);

  const showSkeleton = isLoading && articles.length === 0;
  const showEmptyState = !isLoading && visibleArticles.length === 0;

  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground />

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12 pb-24">
        <NewsHero latestHeadlines={latestHeadlines} />
        <Disclaimer />

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CategoryFilter counts={counts} activeCategory={activeCategory} onSelect={setActiveCategory} />
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Status row: last updated + manual refresh + partial-failure notice */}
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          {updatedAt && (
            <span>
              Last updated <span className="text-slate-400">{timeAgo(updatedAt)}</span> · refreshes hourly
            </span>
          )}
          <button
            onClick={reload}
            className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" strokeLinecap="round" />
              <path d="M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh now
          </button>
          {failedCategories.length > 0 && (
            <span className="text-amber-400/80">
              Couldn&apos;t load: {failedCategories.join(", ")}
            </span>
          )}
        </div>

        {/* Error banner — shown alongside stale data if we have any */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {showSkeleton ? (
          <NewsSkeleton />
        ) : showEmptyState ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-slate-400">
            No articles match your filters right now. Try a different category or search term.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleArticles.map((article, i) => (
              <NewsCard key={article.id} article={article} delay={Math.min(i * 0.04, 0.3)} />
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-slate-600 text-xs mt-12"
        >
          Headlines via Google News · original reporting belongs to the linked publishers
        </motion.p>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wiring this page up (two small edits to your existing files):
//
// 1) Install a router (one-time):
//      npm install react-router-dom
//
// 2) Edit src/main.jsx to add routing. Replace its contents with:
//
//      import React from "react";
//      import ReactDOM from "react-dom/client";
//      import { BrowserRouter, Routes, Route } from "react-router-dom";
//      import App from "./App.jsx";
//      import WhyIDontLikeMyCountry from "./pages/WhyIDontLikeMyCountry.jsx";
//      import "./index.css";
//
//      ReactDOM.createRoot(document.getElementById("root")).render(
//        <React.StrictMode>
//          <BrowserRouter>
//            <Routes>
//              <Route path="/" element={<App />} />
//              <Route path="/why-i-dont-like-my-country" element={<WhyIDontLikeMyCountry />} />
//            </Routes>
//          </BrowserRouter>
//        </React.StrictMode>
//      );
//
// That's it — visiting /why-i-dont-like-my-country will render this page.
// Optionally link to it from your existing SocialsRow or footer in App.jsx.
// ---------------------------------------------------------------------------
