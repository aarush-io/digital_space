
// =============================================================================
// DIGITAL SPACE — Complete Personal Bio Page
// Single-file artifact version (all components, hooks, config included)
// For Vite + React + Tailwind + Framer Motion project, split into src/ as shown
// =============================================================================

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// =============================================================================
// src/config/siteConfig.js
// =============================================================================
const siteConfig = {
  name: "Alex Rivera",
  handle: "@alexrivera",
  bio: "Building things that matter. Obsessed with clean code & broken synthesizers.",
  location: "San Francisco, CA",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera&backgroundColor=b6e3f4",
  badges: ["Student", "Builder", "Music", "Open Source", "Coffee"],

  discordId: "794644730064576522",   // Replace with real ID
  githubUsername: "torvalds",        // Replace with your username

  socials: [
    { id: "github",    label: "GitHub",    href: "https://github.com/",        color: "#e2e8f0" },
    { id: "twitter",   label: "Twitter/X", href: "https://x.com/",                    color: "#60a5fa" },
    { id: "instagram", label: "Instagram", href: "https://instagram.com/",             color: "#f472b6" },
    { id: "discord",   label: "Discord",   href: "https://discord.com/",               color: "#818cf8" },
    { id: "email",     label: "Email",     href: "mailto:alex@example.com",            color: "#34d399" },
  ],

  about: {
    whoAmI: "I'm a 20-year-old computer science student and indie maker. I love exploring the intersection of design, code, and music.",
    building: "A minimal SaaS tool for tracking personal reading habits with beautiful data visualizations.",
    learning: "Systems programming in Rust, advanced DSP concepts, and the art of making things people actually use.",
    techStack: ["React", "TypeScript", "Rust", "Node.js", "PostgreSQL", "Figma", "Linux", "WebAudio API"],
  },

  currently: {
    building: "ReadStack — personal reading tracker",
    studying: "Rust & Operating Systems (CS 162)",
    listening: "Floating Points, Jon Hopkins, Bicep",
  },
};

// =============================================================================
// src/hooks/useDiscord.js
// =============================================================================
function useDiscord(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    const fetch_ = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch_();
    timer = setInterval(fetch_, 15000);
    return () => clearInterval(timer);
  }, [userId]);

  return { data, loading };
}

// =============================================================================
// src/hooks/useGitHub.js
// =============================================================================
function useGitHub(username) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [username]);
  return { data, loading };
}

// =============================================================================
// src/hooks/useProfileViews.js
// =============================================================================
function useProfileViews() {
  const [views, setViews] = useState(0);
  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem("profile_views") || "0", 10);
      const updated = stored + 1;
      localStorage.setItem("profile_views", String(updated));
      setViews(updated);
    } catch { setViews(1); }
  }, []);
  return views;
}

// =============================================================================
// ICONS (inline SVG components — no external icon library needed)
// =============================================================================
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    github:    <><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></>,
    twitter:   <><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    discord:   <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    email:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    location:  <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    play:      <><polygon points="5 3 19 12 5 21 5 3"/></>,
    pause:     <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    skip:      <><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></>,
    music:     <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    code:      <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    book:      <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    headphone: <><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></>,
    hammer:    <><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></>,
    star:      <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    git_fork:  <><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      {icons[name] || null}
    </svg>
  );
};

// =============================================================================
// src/components/ui/GlassCard.jsx
// =============================================================================
const GlassCard = ({ children, className = "", delay = 0, hover = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
    className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

// =============================================================================
// src/components/background/AnimatedBackground.jsx
// =============================================================================
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[#020817]" />
    {/* Blobs */}
    {[
      { color: "rgba(99,102,241,0.25)",   top: "5%",   left: "10%",  size: 600, dur: 18 },
      { color: "rgba(139,92,246,0.2)",    top: "60%",  left: "70%",  size: 500, dur: 22 },
      { color: "rgba(59,130,246,0.18)",   top: "30%",  left: "55%",  size: 450, dur: 16 },
      { color: "rgba(16,185,129,0.12)",   top: "75%",  left: "15%",  size: 400, dur: 25 },
      { color: "rgba(236,72,153,0.1)",    top: "20%",  left: "80%",  size: 350, dur: 20 },
    ].map((blob, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-[80px] will-change-transform"
        style={{ background: blob.color, width: blob.size, height: blob.size, top: blob.top, left: blob.left }}
        animate={{ x: [0, 60, -40, 0], y: [0, -50, 40, 0] }}
        transition={{ duration: blob.dur, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
      />
    ))}
    {/* Subtle grid */}
    <div className="absolute inset-0 opacity-[0.03]"
      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
  </div>
);

// =============================================================================
// src/components/profile/ProfileCard.jsx
// =============================================================================
const ProfileCard = ({ config, views }) => (
  <GlassCard delay={0.1}>
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 blur-md opacity-60 scale-110" />
          <img src={config.profileImage} alt={config.name}
            className="relative w-24 h-24 rounded-full border-2 border-white/20 object-cover bg-slate-800" />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#020817] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}>{config.name}</h1>
            <span className="text-sm text-slate-400 font-mono">{config.handle}</span>
          </div>
          <p className="text-slate-300 text-sm sm:text-base mb-3 max-w-sm leading-relaxed">{config.bio}</p>
          {/* Location + Views */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1"><Icon name="location" size={13} />{config.location}</span>
            <span className="flex items-center gap-1"><Icon name="eye" size={13} />{views.toLocaleString()} profile views</span>
          </div>
          {/* Badge Tags */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {config.badges.map(b => (
              <span key={b} className="px-2.5 py-1 text-xs rounded-full border border-white/10 bg-white/5 text-slate-300 font-medium">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
);

// =============================================================================
// src/components/socials/SocialsRow.jsx
// =============================================================================
const SocialIcon = ({ social }) => {
  const iconMap = { github: "github", twitter: "twitter", instagram: "instagram", discord: "discord", email: "email" };
  return (
    <motion.a href={social.href} target="_blank" rel="noopener noreferrer"
      whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }}
      className="relative group flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-200"
      style={{ "--glow": social.color }}
      title={social.label}>
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ boxShadow: `0 0 20px 0 ${social.color}55, inset 0 0 20px 0 ${social.color}11`, background: `${social.color}11` }} />
      <span style={{ color: social.color }} className="relative z-10 transition-colors">
        <Icon name={iconMap[social.id] || "email"} size={18} />
      </span>
    </motion.a>
  );
};

const SocialsRow = ({ socials }) => (
  <GlassCard delay={0.15} hover={false}>
    <div className="px-6 py-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Connect</p>
      <div className="flex items-center gap-3 flex-wrap">
        {socials.map(s => <SocialIcon key={s.id} social={s} />)}
      </div>
    </div>
  </GlassCard>
);

// =============================================================================
// src/components/discord/DiscordCard.jsx
// =============================================================================
const statusColors = { online: "#22c55e", idle: "#eab308", dnd: "#ef4444", offline: "#6b7280" };
const statusLabel  = { online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline" };

const DiscordCard = ({ userId }) => {
  const { data, loading } = useDiscord(userId);
  const status = data?.discord_status || "offline";

  return (
    <GlassCard delay={0.2}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Discord Presence</p>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: statusColors[status] }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusColors[status] }} />
            {statusLabel[status]}
          </span>
        </div>

        {loading && <div className="flex items-center gap-3 animate-pulse"><div className="w-12 h-12 rounded-full bg-white/10"/><div className="flex-1 space-y-2"><div className="h-3 bg-white/10 rounded w-1/2"/><div className="h-2.5 bg-white/10 rounded w-1/3"/></div></div>}

        {!loading && data && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={data.discord_user?.avatar ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=64` : `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`}
                  alt="Discord Avatar" className="w-12 h-12 rounded-full border border-white/10" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#020817]"
                  style={{ background: statusColors[status] }} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{data.discord_user?.global_name || data.discord_user?.username}</p>
                <p className="text-slate-400 text-xs font-mono">@{data.discord_user?.username}</p>
              </div>
            </div>

            {/* Activities */}
            {data.activities?.filter(a => a.type !== 2).slice(0,1).map(act => (
              <div key={act.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                {act.assets?.large_image && <img src={act.assets.large_image.startsWith("mp:") ? `https://media.discordapp.net/${act.assets.large_image.slice(3)}` : `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.png`} alt="" className="w-10 h-10 rounded-lg" />}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{act.name}</p>
                  <p className="text-slate-500 text-xs truncate">{act.details}</p>
                  {act.state && <p className="text-slate-500 text-xs truncate">{act.state}</p>}
                </div>
              </div>
            ))}

            {/* Spotify */}
            {data.spotify && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1DB95411] border border-[#1DB95430]">
                <img src={data.spotify.album_art_url} alt="" className="w-10 h-10 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#1DB954] text-xs font-semibold mb-0.5">Listening on Spotify</p>
                  <p className="text-white text-xs font-medium truncate">{data.spotify.song}</p>
                  <p className="text-slate-400 text-xs truncate">{data.spotify.artist}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !data && (
          <p className="text-slate-500 text-sm text-center py-2">Could not load Discord presence</p>
        )}
      </div>
    </GlassCard>
  );
};

// =============================================================================
// src/components/github/GitHubCard.jsx
// =============================================================================
const GitHubCard = ({ username }) => {
  const { data, loading } = useGitHub(username);

  return (
    <GlassCard delay={0.25}>
      <div className="p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">GitHub</p>
        {loading && <div className="animate-pulse space-y-3"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-white/10"/><div className="flex-1 space-y-2"><div className="h-3 bg-white/10 rounded w-1/2"/><div className="h-2.5 bg-white/10 rounded w-1/3"/></div></div></div>}
        {!loading && data && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <img src={data.avatar_url} alt={username} className="w-12 h-12 rounded-full border border-white/10" />
              <div>
                <p className="text-white font-semibold text-sm">{data.name || username}</p>
                <p className="text-slate-400 text-xs font-mono">@{data.login}</p>
              </div>
              <a href={data.html_url} target="_blank" rel="noopener noreferrer"
                className="ml-auto px-3 py-1.5 text-xs rounded-lg border border-white/10 text-slate-300 hover:bg-white/10 transition-colors">
                View →
              </a>
            </div>
            {data.bio && <p className="text-slate-400 text-xs mb-4 leading-relaxed">{data.bio}</p>}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Followers",    value: data.followers, icon: "user" },
                { label: "Following",    value: data.following, icon: "user" },
                { label: "Repos",        value: data.public_repos, icon: "code" },
              ].map(stat => (
                <div key={stat.label} className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-white font-bold text-lg leading-none mb-1">{(stat.value||0).toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </GlassCard>
  );
};

// =============================================================================
// src/components/about/AboutCard.jsx
// =============================================================================
const TechPill = ({ tech }) => (
  <motion.span whileHover={{ scale: 1.08 }}
    className="px-3 py-1 text-xs rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-mono cursor-default select-none"
    style={{ boxShadow: "0 0 8px rgba(139,92,246,0.15)" }}>
    {tech}
  </motion.span>
);

const AboutCard = ({ about }) => (
  <GlassCard delay={0.3}>
    <div className="p-5 sm:p-6 space-y-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">About Me</p>
      {[
        { icon: "user",    label: "Who I am",       text: about.whoAmI },
        { icon: "hammer",  label: "Building",       text: about.building },
        { icon: "book",    label: "Learning",       text: about.learning },
      ].map(item => (
        <div key={item.label} className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-0.5">
            <Icon name={item.icon} size={13} className="text-violet-400" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">{item.label}</p>
            <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
          </div>
        </div>
      ))}
      {/* Tech Stack */}
      <div>
        <p className="text-slate-500 text-xs font-medium mb-2.5">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {about.techStack.map(t => <TechPill key={t} tech={t} />)}
        </div>
      </div>
    </div>
  </GlassCard>
);

// =============================================================================
// src/components/currently/CurrentlyCard.jsx
// =============================================================================
const CurrentlyCard = ({ currently }) => (
  <GlassCard delay={0.35}>
    <div className="p-5 sm:p-6">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Currently</p>
      <div className="space-y-3">
        {[
          { icon: "hammer",    label: "Building",  value: currently.building },
          { icon: "book",      label: "Studying",  value: currently.studying },
          { icon: "headphone", label: "Listening", value: currently.listening },
        ].map(item => (
          <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-violet-400 mt-0.5"><Icon name={item.icon} size={14} /></span>
            <div className="flex-1 min-w-0">
              <span className="text-slate-500 text-xs">{item.label}: </span>
              <span className="text-slate-200 text-sm">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </GlassCard>
);

// =============================================================================
// src/components/music/MusicPlayer.jsx
// =============================================================================
const MusicPlayer = ({ playlist }) => {
  const { audioRef, currentTrack, isPlaying, progress, currentTime, duration, togglePlay, skipNext, seek, fmt } = useMusicPlayer(playlist);

  return (
    <GlassCard delay={0.4} hover={false}>
      <audio ref={audioRef} />
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Now Playing</p>
        <div className="flex items-center gap-4">
          {/* Rotating cover */}
          <div className="relative flex-shrink-0">
            <motion.img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-xl border border-white/10 object-cover"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatType: "loop" }}
              style={{ willChange: "transform" }}
            />
            {isPlaying && (
              <div className="absolute inset-0 rounded-xl"
                style={{ boxShadow: "0 0 20px rgba(139,92,246,0.5)" }} />
            )}
          </div>

          {/* Track info + controls */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{currentTrack.title}</p>
            <p className="text-slate-400 text-xs truncate mb-3">{currentTrack.artist}</p>

            {/* Progress */}
            <div className="relative group mb-2.5">
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seek((e.clientX - rect.left) / rect.width);
                }}>
                <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400"
                  style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs font-mono">{fmt(currentTime)}</span>
              <div className="flex items-center gap-2">
                <motion.button onClick={togglePlay} whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 transition-colors text-white"
                  style={{ boxShadow: "0 0 14px rgba(139,92,246,0.5)" }}>
                  <Icon name={isPlaying ? "pause" : "play"} size={14} />
                </motion.button>
                <motion.button onClick={skipNext} whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-slate-300">
                  <Icon name="skip" size={13} />
                </motion.button>
              </div>
              <span className="text-slate-500 text-xs font-mono">{fmt(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// =============================================================================
// App.jsx — Main layout
// =============================================================================
export default function App() {
  const views = useProfileViews();

  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <AnimatedBackground />

      {/* Page wrapper */}
      <div className="relative z-10 max-w-[520px] mx-auto px-4 py-12 pb-20 space-y-3">

        {/* Header label */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Digital Space
          </span>
        </motion.div>

        <ProfileCard config={siteConfig} views={views} />
        <SocialsRow socials={siteConfig.socials} />

        {/* Two-column for Discord + GitHub on wider screens */}
        <div className="grid grid-cols-1 gap-3">
          <DiscordCard userId={siteConfig.discordId} />
          <GitHubCard username={siteConfig.githubUsername} />
        </div>

        <AboutCard about={siteConfig.about} />
        <CurrentlyCard currently={siteConfig.currently} />

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center text-slate-600 text-xs pt-4">
          Built with ♥ & too much caffeine
        </motion.p>
      </div>
    </div>
  );
}
