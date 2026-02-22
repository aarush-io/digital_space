// src/components/discord/DiscordCard.jsx
import GlassCard from "../ui/GlassCard";
import { useDiscord } from "../../hooks/useDiscord";

const STATUS_COLOR = {
  online:  "#22c55e",
  idle:    "#eab308",
  dnd:     "#ef4444",
  offline: "#6b7280",
};
const STATUS_LABEL = {
  online:  "Online",
  idle:    "Idle",
  dnd:     "Do Not Disturb",
  offline: "Offline",
};

const Skeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-2.5 bg-white/10 rounded w-1/3" />
      </div>
    </div>
  </div>
);

const DiscordCard = ({ userId }) => {
  const { data, loading } = useDiscord(userId);
  const status = data?.discord_status || "offline";

  const avatarUrl = data?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=64`
    : `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;

  return (
    <GlassCard delay={0.2}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Discord Presence
          </p>
          <span
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: STATUS_COLOR[status] }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: STATUS_COLOR[status],
                boxShadow: `0 0 6px ${STATUS_COLOR[status]}`,
                animation: status === "online" ? "pulse 2s infinite" : "none",
              }}
            />
            {STATUS_LABEL[status]}
          </span>
        </div>

        {loading && <Skeleton />}

        {!loading && !data && (
          <p className="text-slate-500 text-sm text-center py-2">
            Discord presence unavailable
          </p>
        )}

        {!loading && data && (
          <div className="space-y-3">
            {/* User row */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Discord avatar"
                  className="w-12 h-12 rounded-full border border-white/15"
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#020817]"
                  style={{ background: STATUS_COLOR[status] }}
                />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none mb-1">
                  {data.discord_user?.global_name || data.discord_user?.username}
                </p>
                <p className="text-slate-400 text-xs font-mono">
                  @{data.discord_user?.username}
                </p>
              </div>
            </div>

            {/* Non-Spotify activities */}
            {data.activities
              ?.filter((a) => a.type !== 2)
              .slice(0, 1)
              .map((act) => {
                const imgSrc = act.assets?.large_image?.startsWith("mp:")
                  ? `https://media.discordapp.net/${act.assets.large_image.slice(3)}`
                  : act.application_id && act.assets?.large_image
                  ? `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.png`
                  : null;

                return (
                  <div
                    key={act.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5"
                  >
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-xs font-medium truncate">
                        {act.name}
                      </p>
                      {act.details && (
                        <p className="text-slate-500 text-xs truncate">{act.details}</p>
                      )}
                      {act.state && (
                        <p className="text-slate-500 text-xs truncate">{act.state}</p>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Spotify */}
            {data.spotify && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1DB95410] border border-[#1DB95430]">
                <img
                  src={data.spotify.album_art_url}
                  alt="Album art"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[#1DB954] text-xs font-semibold mb-0.5">
                    Listening on Spotify
                  </p>
                  <p className="text-white text-xs font-medium truncate">
                    {data.spotify.song}
                  </p>
                  <p className="text-slate-400 text-xs truncate">
                    {data.spotify.artist}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default DiscordCard;
