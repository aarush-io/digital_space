// src/App.jsx
import { motion } from "framer-motion";
import siteConfig from "./config/siteConfig";

// Background
import AnimatedBackground from "./components/background/AnimatedBackground";

// Cards
import ProfileCard   from "./components/profile/ProfileCard";
import SocialsRow    from "./components/socials/SocialsRow";
import DiscordCard   from "./components/discord/DiscordCard";
import GitHubCard    from "./components/github/GitHubCard";
import AboutCard     from "./components/about/AboutCard";
import CurrentlyCard from "./components/currently/CurrentlyCard";
import MusicPlayer   from "./components/music/MusicPlayer";

// Hook
import { useProfileViews } from "./hooks/useProfileViews";

export default function App() {
  const views = useProfileViews(); // ✅ global counter

  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground />

      {/* Main container */}
      <main className="relative z-10 max-w-[520px] mx-auto px-4 py-12 pb-20">

        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Digital Space
          </span>
        </motion.div>

        {/* Cards stack */}
        <div className="space-y-3">

          <ProfileCard
            config={siteConfig}
            views={views || 0}   // ✅ crash-safe
          />

          <SocialsRow socials={siteConfig.socials} />

          <DiscordCard userId={siteConfig.discordId} />

          <GitHubCard username={siteConfig.githubUsername} />

          <AboutCard about={siteConfig.about} />

          <CurrentlyCard currently={siteConfig.currently} />

          <MusicPlayer playlist={siteConfig.playlist} />

        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center text-slate-600 text-xs mt-8"
        >
          Built with ♥ & too much caffeine
        </motion.p>

      </main>
    </div>
  );
}
