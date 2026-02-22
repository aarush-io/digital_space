// src/hooks/useMusicPlayer.js
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for managing audio playback with:
 * - Random first track
 * - Auto-advance to random next (no consecutive repeat)
 * - Play / pause / seek / skip
 */
export function useMusicPlayer(playlist) {
  const audioRef = useRef(null);
  const lastIndexRef = useRef(-1);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = Math.floor(Math.random() * playlist.length);
    lastIndexRef.current = idx;
    return idx;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = playlist[currentIndex];

  // Pick a random index that isn't the same as the last one
  const getNextIndex = useCallback(() => {
    if (playlist.length <= 1) return 0;
    let next;
    do {
      next = Math.floor(Math.random() * playlist.length);
    } while (next === lastIndexRef.current);
    return next;
  }, [playlist.length]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const skipNext = useCallback(() => {
    lastIndexRef.current = currentIndex;
    setCurrentIndex(getNextIndex());
    setIsPlaying(true);
  }, [currentIndex, getNextIndex]);

  const seek = useCallback(
    (fraction) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = Math.max(0, Math.min(fraction * duration, duration));
    },
    [duration]
  );

  // Attach audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.currentTime / (audio.duration || 1));
    };
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => skipNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [skipNext]);

  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.src) return;
    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const fmt = (seconds) => {
    const s = Math.floor(seconds || 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return {
    audioRef,
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    togglePlay,
    skipNext,
    seek,
    fmt,
  };
}
