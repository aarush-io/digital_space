// src/components/news/NewsHero.jsx
//
// Place at: src/components/news/NewsHero.jsx

import { motion } from "framer-motion";

const NewsHero = ({ latestHeadlines = [] }) => {
  // Duplicate the list so the marquee loops seamlessly at -50%.
  const tickerItems = [...latestHeadlines, ...latestHeadlines];

  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-6"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border border-[#e79a3a]/30 bg-[#e79a3a]/10 text-[#f5b155] font-medium select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5b155] animate-pulse" />
          Live Dashboard
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="font-display font-extrabold text-3xl sm:text-5xl leading-tight tracking-tight text-white"
      >
        Why I Don&apos;t Like My Own Country
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed"
      >
        This page automatically collects recent news about issues I believe deserve
        more attention. The headlines come from third-party news sources.
      </motion.p>

      {/* Scrolling wire-ticker of the latest headlines */}
      {tickerItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mt-7 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-2"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#020817] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#020817] to-transparent z-10" />
          <motion.div
            className="flex whitespace-nowrap gap-10 font-mono text-[11px] text-slate-500"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            {tickerItems.map((headline, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                {headline}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NewsHero;
