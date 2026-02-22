// src/hooks/useDiscord.js
import { useState, useEffect } from "react";

/**
 * Fetches Discord presence data via Lanyard API.
 * Auto-refreshes every 15 seconds.
 * Docs: https://api.lanyard.rest
 */
export function useDiscord(userId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchPresence = async () => {
      try {
        const res  = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        if (cancelled) return;
        if (json.success) {
          setData(json.data);
          setError(null);
        } else {
          setError("User not found");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 15_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  return { data, loading, error };
}
