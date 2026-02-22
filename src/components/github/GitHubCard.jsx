// src/components/github/GitHubCard.jsx
import GlassCard from "../ui/GlassCard";
import { useGitHub } from "../../hooks/useGitHub";

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-2.5 bg-white/10 rounded w-1/3" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-14 bg-white/5 rounded-xl" />
      ))}
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
    <p className="text-white font-bold text-lg leading-none mb-1">
      {(value ?? 0).toLocaleString()}
    </p>
    <p className="text-slate-500 text-xs">{label}</p>
  </div>
);

const GitHubCard = ({ username }) => {
  const { data, loading } = useGitHub(username);

  return (
    <GlassCard delay={0.25}>
      <div className="p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          GitHub
        </p>

        {loading && <Skeleton />}

        {!loading && !data && (
          <p className="text-slate-500 text-sm text-center py-2">
            GitHub profile unavailable
          </p>
        )}

        {!loading && data && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={data.avatar_url}
                alt={username}
                className="w-12 h-12 rounded-full border border-white/15"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {data.name || username}
                </p>
                <p className="text-slate-400 text-xs font-mono">@{data.login}</p>
              </div>
              <a
                href={data.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
              >
                View →
              </a>
            </div>

            {data.bio && (
              <p className="text-slate-400 text-xs leading-relaxed mb-3">{data.bio}</p>
            )}

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Followers"  value={data.followers} />
              <Stat label="Following"  value={data.following} />
              <Stat label="Repos"      value={data.public_repos} />
            </div>
          </>
        )}
      </div>
    </GlassCard>
  );
};

export default GitHubCard;
