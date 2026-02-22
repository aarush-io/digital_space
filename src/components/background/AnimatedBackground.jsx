// src/components/background/AnimatedBackground.jsx
import { motion } from "framer-motion";

const BLOBS = [
  { color: "rgba(99,102,241,0.28)",  top: "5%",   left: "10%",  size: 620, duration: 18 },
  { color: "rgba(139,92,246,0.22)",  top: "62%",  left: "68%",  size: 520, duration: 22 },
  { color: "rgba(59,130,246,0.20)",  top: "32%",  left: "56%",  size: 460, duration: 16 },
  { color: "rgba(16,185,129,0.12)",  top: "78%",  left: "12%",  size: 400, duration: 25 },
  { color: "rgba(236,72,153,0.11)",  top: "15%",  left: "78%",  size: 360, duration: 20 },
];

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Base dark bg */}
    <div className="absolute inset-0 bg-[#020817]" />

    {/* Animated blobs */}
    {BLOBS.map((blob, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-[100px] will-change-transform"
        style={{
          background: blob.color,
          width:  blob.size,
          height: blob.size,
          top:    blob.top,
          left:   blob.left,
          marginLeft: -blob.size / 2,
          marginTop:  -blob.size / 2,
        }}
        animate={{
          x: [0, 70, -50, 30, 0],
          y: [0, -60, 50, -30, 0],
          scale: [1, 1.08, 0.94, 1.04, 1],
        }}
        transition={{
          duration: blob.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 1.8,
        }}
      />
    ))}

    {/* Subtle dot-grid noise */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }}
    />

    {/* Vignette overlay */}
    <div className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(2,8,23,0.7) 100%)" }} />
  </div>
);

export default AnimatedBackground;
