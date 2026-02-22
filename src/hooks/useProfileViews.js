// src/hooks/useProfileViews.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "profile_views";

/**
 * Increments a visit counter in localStorage and returns the current count.
 */
export function useProfileViews() {
  const [views, setViews] = useState(0);

  useEffect(() => {
    try {
      const stored  = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      const updated = (isNaN(stored) ? 0 : stored) + 1;
      localStorage.setItem(STORAGE_KEY, String(updated));
      setViews(updated);
    } catch {
      // localStorage blocked (private mode, etc.)
      setViews(1);
    }
  }, []);

  return views;
}
