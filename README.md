# 🌌 Digital Space

A production-ready personal bio page with glassmorphism aesthetic, live Discord presence, GitHub stats, and a custom music player.

## ✨ Features

- **Animated Background** — floating blurred blobs on a deep dark gradient
- **Profile Card** — avatar, bio, badges, location, localStorage view counter
- **Social Links Row** — glowing icon buttons with hover glow per-color
- **Discord Presence (Live)** — Lanyard API, auto-refresh every 15s, Spotify display
- **GitHub Card (Live)** — followers, following, public repos
- **About Me** — who/building/learning + glowing tech stack pills
- **Currently** — editable status fields from config
- **Music Player** — random shuffle, no consecutive repeat, rotating cover art, seekable progress bar

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🔧 Configuration

Edit **`src/config/siteConfig.js`** — this is the single source of truth for all content:

```js
const siteConfig = {
  name: "Your Name",
  handle: "@yourhandle",
  bio: "Your bio here.",
  location: "City, Country",
  profileImage: "https://...",
  badges: ["Student", "Builder"],

  discordId: "YOUR_DISCORD_USER_ID",   // ← Get from Discord > Settings > Advanced > Developer Mode
  githubUsername: "your-username",     // ← Your GitHub username

  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/you", color: "#e2e8f0" },
    // ...
  ],

  about: {
    whoAmI: "...",
    building: "...",
    learning: "...",
    techStack: ["React", "TypeScript"],
  },

  currently: {
    building: "...",
    studying: "...",
    listening: "...",
  },

  playlist: [
    { id: 1, title: "Track Name", artist: "Artist", cover: "https://...", src: "/audio/track.mp3" },
    // Add 9 more...
  ],
};
```

### Music Files

Place audio files in `/public/audio/` and reference them in the playlist:
```js
{ id: 1, title: "Track", artist: "Artist", cover: "/covers/1.jpg", src: "/audio/track1.mp3" }
```

### Discord Presence (Lanyard)

1. Join the [Lanyard Discord server](https://discord.gg/lanyard)
2. Your Discord ID is auto-registered
3. Set your `discordId` in `siteConfig.js`

## 📁 Project Structure

```
src/
├── config/
│   └── siteConfig.js          ← All content lives here
├── hooks/
│   ├── useMusicPlayer.js      ← Audio logic hook
│   ├── useDiscord.js          ← Lanyard API hook (15s refresh)
│   ├── useGitHub.js           ← GitHub API hook
│   └── useProfileViews.js     ← localStorage view counter
├── components/
│   ├── ui/
│   │   ├── GlassCard.jsx      ← Reusable glassmorphism card
│   │   └── Icon.jsx           ← Self-contained SVG icons
│   ├── background/
│   │   └── AnimatedBackground.jsx
│   ├── profile/
│   │   └── ProfileCard.jsx
│   ├── socials/
│   │   └── SocialsRow.jsx
│   ├── discord/
│   │   └── DiscordCard.jsx
│   ├── github/
│   │   └── GitHubCard.jsx
│   ├── about/
│   │   └── AboutCard.jsx
│   ├── currently/
│   │   └── CurrentlyCard.jsx
│   └── music/
│       └── MusicPlayer.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🚢 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo to [Vercel](https://vercel.com) for automatic deployments.

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **Framer Motion 11**
- **Lanyard API** for Discord presence
- **GitHub REST API** for profile stats
