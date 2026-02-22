// src/components/profile/ProfileCard.jsx
import GlassCard from "../ui/GlassCard";
import { Icon } from "../ui/Icon";

const ProfileCard = ({ config, views }) => (
  <GlassCard delay={0.1}>
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar with glow */}
        <div className="relative flex-shrink-0">
          <div
            className="absolute inset-0 rounded-full blur-md opacity-70 scale-110"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
          />
          <img
            src={config.profileImage}
            alt={config.name}
            className="relative w-24 h-24 rounded-full border-2 border-white/20 object-cover bg-slate-800"
          />
          {/* Online dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#020817]"
            style={{ boxShadow: "0 0 8px rgba(52,211,153,0.8)" }} />
        </div>

        {/* Name + bio */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mb-1">
            <h1
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {config.name}
            </h1>
            <span className="text-sm text-slate-500 font-mono">{config.handle}</span>
          </div>

          <p className="text-slate-300 text-sm sm:text-base mb-3 max-w-sm leading-relaxed">
            {config.bio}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1.5">
              <Icon name="location" size={12} />
              {config.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="eye" size={12} />
              {views.toLocaleString()} views
            </span>
          </div>

          {/* Badge pills */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {config.badges.map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 text-xs rounded-full border border-white/10 bg-white/5 text-slate-300 font-medium select-none"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
);

export default ProfileCard;
