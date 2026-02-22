// src/components/socials/SocialsRow.jsx
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import { Icon } from "../ui/Icon";

const ICON_MAP = {
  github:    "github",
  twitter:   "twitter",
  instagram: "instagram",
  discord:   "discord",
  email:     "email",
};

const SocialButton = ({ social }) => (
  <motion.a
    href={social.href}
    target={social.id === "email" ? "_self" : "_blank"}
    rel="noopener noreferrer"
    title={social.label}
    whileHover={{ scale: 1.15, y: -3 }}
    whileTap={{ scale: 0.9 }}
    className="relative group flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur cursor-pointer"
    style={{ color: social.color }}
  >
    {/* Glow overlay on hover */}
    <div
      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      style={{
        background:  `${social.color}18`,
        boxShadow:   `0 0 22px ${social.color}50, inset 0 0 22px ${social.color}12`,
        border:      `1px solid ${social.color}40`,
      }}
    />
    <span className="relative z-10">
      <Icon name={ICON_MAP[social.id] || "email"} size={18} />
    </span>
  </motion.a>
);

const SocialsRow = ({ socials }) => (
  <GlassCard delay={0.15} hover={false}>
    <div className="px-5 py-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        Connect
      </p>
      <div className="flex items-center gap-2.5 flex-wrap">
        {socials.map((s) => (
          <SocialButton key={s.id} social={s} />
        ))}
      </div>
    </div>
  </GlassCard>
);

export default SocialsRow;
