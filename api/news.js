// api/news.js
//
// Vercel serverless function — place at the ROOT of your repo (not inside src/),
// i.e. exactly at:  /api/news.js
//
// Vercel auto-detects any file under /api as a serverless function regardless
// of frontend framework, so this works alongside your existing Vite build
// with zero extra config. Locally, `vercel dev` will serve it at
// http://localhost:3000/api/news. Plain `vite dev` does NOT run this file —
// see the README note at the bottom of this file for local testing options.
//
// Responsibilities:
//   - Fetch one Google News RSS feed per category (parallel, fault-tolerant)
//   - Parse the XML
//   - Classify each article by keyword scoring (refines the feed's own category hint)
//   - De-duplicate by article link
//   - Cache the merged result in memory for CACHE_TTL_MS
//   - Serve /api/news -> { articles, updatedAt, cached, failedCategories }

import { XMLParser } from "fast-xml-parser";

// ---- Country configuration -------------------------------------------------
// Change these three values to point the dashboard at a different country.
const COUNTRY_NAME = "India";
const HL = "en-IN"; // language/region for Google News UI
const GL = "IN"; // country
const CEID = "IN:en"; // content edition

// One search query per category, run as a separate Google News RSS feed.
const CATEGORY_QUERIES = {
  Corruption: `${COUNTRY_NAME} corruption scam bribery scandal`,
  Crime: `${COUNTRY_NAME} crime violence police`,
  Environment: `${COUNTRY_NAME} pollution environment climate deforestation`,
  Infrastructure: `${COUNTRY_NAME} infrastructure roads collapse civic failure`,
  Healthcare: `${COUNTRY_NAME} healthcare hospital public health crisis`,
  Education: `${COUNTRY_NAME} education schools students crisis`,
  Economy: `${COUNTRY_NAME} economy unemployment inflation poverty`,
  Politics: `${COUNTRY_NAME} politics government policy protest`,
  "Internet Freedom": `${COUNTRY_NAME} internet shutdown censorship surveillance`,
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_CATEGORY = 20;

// Keyword sets used to refine/override the category a feed was fetched under.
// This catches articles that Google returned for one query but that read
// (by their own title/description) as belonging to a different category.
const KEYWORDS = {
  Corruption: ["corruption", "bribe", "bribery", "scam", "scandal", "graft", "kickback", "embezzle", "fraud"],
  Crime: ["crime", "murder", "assault", "robbery", "kidnap", "gang", "violence", "shooting", "theft", "arrested"],
  Environment: ["pollution", "environment", "climate", "deforestation", "air quality", "toxic", "waste", "flood", "drought", "wildlife"],
  Infrastructure: ["infrastructure", "road collapse", "bridge collapse", "construction", "power cut", "water supply", "transport", "railway accident"],
  Healthcare: ["hospital", "health crisis", "disease", "outbreak", "medicine shortage", "doctor", "healthcare"],
  Education: ["school", "education", "student", "university", "exam", "teacher", "dropout"],
  Economy: ["economy", "unemployment", "inflation", "poverty", "gdp", "recession", "job loss", "wages"],
  Politics: ["politics", "government", "minister", "parliament", "election", "protest", "policy", "party"],
  "Internet Freedom": ["internet shutdown", "censorship", "surveillance", "vpn ban", "social media ban", "content blocked"],
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractThumbnail(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

function classify(text, fallbackCategory) {
  const lower = text.toLowerCase();
  let bestCategory = fallbackCategory;
  let bestScore = 0;
  for (const [category, words] of Object.entries(KEYWORDS)) {
    let score = 0;
    for (const word of words) if (lower.includes(word)) score++;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  return bestScore > 0 ? bestCategory : fallbackCategory;
}

async function fetchCategoryFeed(category, query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=${HL}&gl=${GL}&ceid=${CEID}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsDashboard/1.0)" },
  });

  if (!response.ok) {
    throw new Error(`Feed request failed for "${category}": HTTP ${response.status}`);
  }

  const xml = await response.text();
  const parsed = parser.parse(xml);
  const rawItems = parsed?.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items.slice(0, MAX_PER_CATEGORY).map((item) => {
    const title = typeof item.title === "string" ? item.title : String(item.title ?? "");
    const rawDescription = typeof item.description === "string" ? item.description : "";
    const sourceName =
      item.source && typeof item.source === "object"
        ? item.source["#text"]
        : typeof item.source === "string"
        ? item.source
        : "Unknown source";

    return {
      id: item.link || `${category}-${title}`,
      title: stripHtml(title),
      link: item.link,
      source: sourceName || "Unknown source",
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      description: stripHtml(rawDescription).slice(0, 220),
      thumbnail: extractThumbnail(rawDescription),
      category: classify(`${title} ${rawDescription}`, category),
    };
  });
}

// Module-level cache. Persists across requests on a warm serverless
// instance, and is naturally rebuilt on cold starts — which, combined with
// the 1-hour TTL, is enough for a personal dashboard's "refresh hourly" goal.
let cache = null; // { articles, updatedAt, timestamp, failedCategories }

export default async function handler(req, res) {
  try {
    const now = Date.now();

    if (cache && now - cache.timestamp < CACHE_TTL_MS) {
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=300");
      return res.status(200).json({
        articles: cache.articles,
        updatedAt: cache.updatedAt,
        cached: true,
        failedCategories: cache.failedCategories,
      });
    }

    const entries = Object.entries(CATEGORY_QUERIES);
    const settled = await Promise.allSettled(
      entries.map(([category, query]) => fetchCategoryFeed(category, query))
    );

    const seenLinks = new Set();
    const merged = [];
    const failedCategories = [];

    settled.forEach((result, index) => {
      const [category] = entries[index];
      if (result.status === "fulfilled") {
        for (const article of result.value) {
          if (!article.link || seenLinks.has(article.link)) continue;
          seenLinks.add(article.link);
          merged.push(article);
        }
      } else {
        failedCategories.push(category);
        console.error(`[api/news] ${category} feed failed:`, result.reason?.message || result.reason);
      }
    });

    merged.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const updatedAt = new Date().toISOString();
    cache = { articles: merged, updatedAt, timestamp: now, failedCategories };

    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=300");
    return res.status(200).json({ articles: merged, updatedAt, cached: false, failedCategories });
  } catch (err) {
    console.error("[api/news] fatal error:", err);
    // If we have any stale cache at all, prefer serving it over a hard error.
    if (cache) {
      return res.status(200).json({
        articles: cache.articles,
        updatedAt: cache.updatedAt,
        cached: true,
        failedCategories: cache.failedCategories,
      });
    }
    return res.status(500).json({ error: "Failed to load news right now. Please try again shortly." });
  }
}

// ---- Local dev note ---------------------------------------------------------
// `npm run dev` (plain Vite) does not execute /api functions. To test this
// endpoint locally, install the Vercel CLI (`npm i -g vercel`) and run
// `vercel dev` instead — it serves both the Vite frontend and this function
// together on the same port. In production on Vercel, no extra config needed.
