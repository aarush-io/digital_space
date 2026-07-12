// netlify/functions/news.js
//
// Place at: netlify/functions/news.js
// (Delete or ignore the old api/news.js — that was written for Vercel and
// won't run on Netlify. This file replaces it.)
//
// This is a Netlify Function using the modern "v2" format (Web-standard
// Request/Response, configured with an explicit `path` below), so it's
// reachable at /api/news with no extra redirect rules needed for the route
// itself. You still need netlify.toml (provided alongside this file) so
// Netlify knows where your functions live and to serve index.html for
// client-side routes.
//
// Responsibilities:
//   - Fetch one Google News RSS feed per category (parallel, fault-tolerant)
//   - Parse the XML
//   - Classify each article by keyword scoring (refines the feed's category hint)
//   - De-duplicate by article link
//   - Cache the merged result in memory for CACHE_TTL_MS
//   - Serve GET /api/news -> { articles, updatedAt, cached, failedCategories }

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

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=300",
    },
  });
}

// Module-level cache. Persists across invocations on a warm function
// instance, and naturally rebuilds on cold starts — combined with the
// 1-hour TTL, that's enough for a personal dashboard's hourly-refresh goal.
let cache = null; // { articles, updatedAt, timestamp, failedCategories }

export default async (req, context) => {
  try {
    const now = Date.now();

    if (cache && now - cache.timestamp < CACHE_TTL_MS) {
      return jsonResponse({
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
        console.error(`[news function] ${category} feed failed:`, result.reason?.message || result.reason);
      }
    });

    merged.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const updatedAt = new Date().toISOString();
    cache = { articles: merged, updatedAt, timestamp: now, failedCategories };

    return jsonResponse({ articles: merged, updatedAt, cached: false, failedCategories });
  } catch (err) {
    console.error("[news function] fatal error:", err);
    if (cache) {
      return jsonResponse({
        articles: cache.articles,
        updatedAt: cache.updatedAt,
        cached: true,
        failedCategories: cache.failedCategories,
      });
    }
    return jsonResponse({ error: "Failed to load news right now. Please try again shortly." }, 500);
  }
};

// This registers the function at /api/news directly — no separate redirect
// rule needed for the API route itself.
export const config = { path: "/api/news" };

// ---- Local dev note ---------------------------------------------------------
// Plain `npm run dev` (Vite) does not run Netlify Functions. To test this
// locally, install the Netlify CLI (`npm i -g netlify-cli`) and run
// `netlify dev` from the project root instead — it serves the Vite frontend
// and this function together on one port (usually http://localhost:8888).
