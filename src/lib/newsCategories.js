// src/lib/newsCategories.js
//
// Place at: src/lib/newsCategories.js
//
// Single source of truth for category labels + colors on the frontend.
// Keep the category names in sync with api/news.js's CATEGORY_QUERIES keys
// (plus "Other" for anything the classifier can't confidently place).

export const CATEGORIES = [
  { id: "Corruption", color: "#a78bfa" },
  { id: "Crime", color: "#f87171" },
  { id: "Environment", color: "#4ade80" },
  { id: "Infrastructure", color: "#fb923c" },
  { id: "Healthcare", color: "#f472b6" },
  { id: "Education", color: "#60a5fa" },
  { id: "Economy", color: "#facc15" },
  { id: "Politics", color: "#818cf8" },
  { id: "Internet Freedom", color: "#22d3ee" },
  { id: "Other", color: "#94a3b8" },
];

export function categoryColor(id) {
  return CATEGORIES.find((c) => c.id === id)?.color || "#94a3b8";
}

/** Formats an ISO date string as a short relative time, e.g. "2h ago", "just now". */
export function timeAgo(isoString) {
  if (!isoString) return "";
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
