// src/components/news/CategoryFilter.jsx
//
// Place at: src/components/news/CategoryFilter.jsx

import { CATEGORIES } from "../../lib/newsCategories";

const CategoryFilter = ({ counts, activeCategory, onSelect }) => {
  const totalCount = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={[
          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
          activeCategory === null
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20",
        ].join(" ")}
      >
        All <span className="opacity-60">({totalCount})</span>
      </button>

      {CATEGORIES.filter((c) => counts[c.id]).map((c) => {
        const active = activeCategory === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(active ? null : c.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              backgroundColor: active ? `${c.color}22` : "rgba(255,255,255,0.02)",
              borderColor: active ? `${c.color}66` : "rgba(255,255,255,0.1)",
              color: active ? c.color : "#94a3b8",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
              style={{ backgroundColor: c.color }}
            />
            {c.id} <span className="opacity-60">({counts[c.id]})</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
