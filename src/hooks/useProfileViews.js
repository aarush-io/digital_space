import { useState, useEffect } from "react";

export function useProfileViews() {
  const [views, setViews] = useState(0);

  useEffect(() => {
    fetch("https://api.countapi.xyz/hit/aarushsagar/digitalspace")
      .then((res) => res.json())
      .then((data) => setViews(data.value))
      .catch(() => setViews(0));
  }, []);

  return views;
}
