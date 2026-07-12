// src/components/news/NewsCard.jsx
//
// Place at: src/components/news/NewsCard.jsx
//
// Reuses the site's existing GlassCard (src/components/ui/GlassCard.jsx) so
// this matches the rest of the page's visual language exactly.

import GlassCard from "../ui/GlassCard";
import { categoryColor, timeAgo } from "../../lib/newsCategories";

const NewsCard = ({ article, delay = 0 }) => {
  const color = categoryColor(article.category);

  return (
    <GlassCard delay={delay} className="h-full">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col"
      >
        {article.thumbnail && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/5">
            <img
              src={article.thumbnail}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{ backgroundColor: `${color}1a`, color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
              {article.category}
            </span>
            <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
              {timeAgo(article.publishedAt)}
            </span>
          </div>

          <h3 className="text-sm font-semibold leading-snug text-slate-100 group-hover:text-white transition-colors">
            {article.title}
          </h3>

          {article.description && (
            <p className="line-clamp-3 text-xs leading-relaxed text-slate-400">
              {article.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
            <span className="truncate font-medium text-slate-400">{article.source}</span>
            <span className="inline-flex items-center gap-1 text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
              Read article
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </GlassCard>
  );
};

export default NewsCard;
