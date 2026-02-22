// src/components/music/MusicPlayer.jsx
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import { Icon } from "../ui/Icon";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";

const MusicPlayer = ({ playlist }) => {
  const {
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
  } = useMusicPlayer(playlist);

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek((e.clientX - rect.left) / rect.width);
  };

  return (
    <GlassCard delay={0.4} hover={false}>
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Now Playing
        </p>

        <div className="flex items-center gap-4">
          {/* Rotating album art */}
          <div className="relative flex-shrink-0">
            <motion.img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-xl border border-white/10 object-cover"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
              style={{ willChange: "transform" }}
            />
            {isPlaying && (
              <div
                className="absolute inset-0 rounded-xl"
                style={{ boxShadow: "0 0 24px rgba(139,92,246,0.55)" }}
              />
            )}
          </div>

          {/* Track info + controls */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate mb-0.5">
              {currentTrack.title}
            </p>
            <p className="text-slate-400 text-xs truncate mb-3">
              {currentTrack.artist}
            </p>

            {/* Progress bar */}
            <div
              className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer mb-2 group"
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Time + Buttons */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs font-mono tabular-nums">
                {fmt(currentTime)}
              </span>

              <div className="flex items-center gap-2">
                {/* Play / Pause */}
                <motion.button
                  onClick={togglePlay}
                  whileTap={{ scale: 0.88 }}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-white transition-colors"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                    boxShadow: "0 0 16px rgba(124,58,237,0.5)",
                  }}
                >
                  <Icon name={isPlaying ? "pause" : "play"} size={13} />
                </motion.button>

                {/* Skip */}
                <motion.button
                  onClick={skipNext}
                  whileTap={{ scale: 0.88 }}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-slate-300"
                >
                  <Icon name="skip" size={13} />
                </motion.button>
              </div>

              <span className="text-slate-500 text-xs font-mono tabular-nums">
                {fmt(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default MusicPlayer;
