// src/components/ui/GlassCard.jsx
import { motion } from "framer-motion";

/**
 * Reusable glassmorphism card wrapper.
 * Used by every section card on the page.
 */
const GlassCard = ({
  children,
  className = "",
  delay = 0,
  hover = true,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={[
        "relative rounded-2xl overflow-hidden",
        "border border-white/10",
        "bg-white/[0.04] backdrop-blur-2xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
        className,
      ].join(" ")}
    >
      {/* Inner gradient shimmer */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
