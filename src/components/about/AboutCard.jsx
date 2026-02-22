// src/components/about/AboutCard.jsx
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import { Icon } from "../ui/Icon";

const ROWS = [
  { icon: "user",   label: "Who I am",  key: "whoAmI"   },
  { icon: "hammer", label: "Building",  key: "building"  },
  { icon: "book",   label: "Learning",  key: "learning"  },
];

const TechPill = ({ tech }) => (
  <motion.span
    whileHover={{ scale: 1.07 }}
    className="inline-flex px-3 py-1 text-xs rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-mono cursor-default select-none"
    style={{ boxShadow: "0 0 10px rgba(139,92,246,0.15)" }}
  >
    {tech}
  </motion.span>
);

const AboutCard = ({ about }) => (
  <GlassCard delay={0.3}>
    <div className="p-5 sm:p-6 space-y-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
        About Me
      </p>

      {ROWS.map(({ icon, label, key }) => (
        <div key={key} className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-0.5">
            <Icon name={icon} size={13} className="text-violet-400" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium mb-0.5">{label}</p>
            <p className="text-slate-200 text-sm leading-relaxed">{about[key]}</p>
          </div>
        </div>
      ))}

      {/* Tech Stack */}
      <div>
        <p className="text-slate-500 text-xs font-medium mb-2.5">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {about.techStack.map((t) => (
            <TechPill key={t} tech={t} />
          ))}
        </div>
      </div>
    </div>
  </GlassCard>
);

export default AboutCard;
