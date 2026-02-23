import { useState, useEffect } from "react";

export function useProfileViews() {
  const [views, setViews] = useState(0);

  useEffect(() => {
    fetch("/.netlify/functions/views")
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => setViews(0));
  }, []);

  return views;
}
