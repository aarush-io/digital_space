// src/hooks/useGitHub.js
import { useState, useEffect } from "react";

/**
 * Fetches GitHub user profile data.
 * Uses the public GitHub REST API (unauthenticated, 60 req/hr).
 * For higher rate limits add a Personal Access Token.
 */
export function useGitHub(username) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    const fetchUser = async () => {
      try {
        const res  = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        const json = await res.json();
        if (!cancelled) { setData(json); setError(null); }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();
    return () => { cancelled = true; };
  }, [username]);

  return { data, loading, error };
}
