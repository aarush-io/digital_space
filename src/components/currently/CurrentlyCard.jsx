// src/components/currently/CurrentlyCard.jsx
import GlassCard from "../ui/GlassCard";
import { Icon } from "../ui/Icon";

const ROWS = [
  { icon: "hammer",    label: "Building",  key: "building"  },
  { icon: "book",      label: "Studying",  key: "studying"  },
  { icon: "headphone", label: "Listening", key: "listening" },
];

const CurrentlyCard = ({ currently }) => (
  <GlassCard delay={0.35}>
    <div className="p-5 sm:p-6">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
        Currently
      </p>
      <div className="space-y-2.5">
        {ROWS.map(({ icon, label, key }) => (
          <div
            key={key}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
          >
            <Icon name={icon} size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-slate-500 text-xs">{label}: </span>
              <span className="text-slate-200 text-sm">{currently[key]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </GlassCard>
);

export default CurrentlyCard;
