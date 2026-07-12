// src/hooks/useNews.js
//
// Place at: src/hooks/useNews.js
//
// Fetches /api/news, keeps it fresh every hour, and exposes loading/error
// state cleanly so the page can show skeletons, an error banner, or data.

import { useCallback, useEffect, useRef, useState } from "react";

const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour, matches server cache TTL

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [failedCategories, setFailedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // true only until the first load resolves
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      const data = await response.json();
      setArticles(Array.isArray(data.articles) ? data.articles : []);
      setUpdatedAt(data.updatedAt || null);
      setFailedCategories(Array.isArray(data.failedCategories) ? data.failedCategories : []);
    } catch (err) {
      setError("Couldn't reach the news feed. Showing the last results we have, if any.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [load]);

  return { articles, updatedAt, failedCategories, isLoading, error, reload: load };
}
