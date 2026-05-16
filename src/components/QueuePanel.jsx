import { usePlayerStore } from "../store";
import AlbumArt from "./AlbumArt";
import Icon from "./Icon";

export default function QueuePanel() {
  const { currentTrack, queue, queueIndex, playTrack, toggleShowQueue } = usePlayerStore();
  const visibleQueue = queue.length > 0 ? queue : currentTrack ? [currentTrack] : [];

  if (!visibleQueue.length) return null;

  return (
    <div
      className="queue-panel"
      style={{
        position: "fixed",
        right: 16,
        bottom: "calc(var(--player-height) + 12px)",
        width: "min(380px, calc(100vw - 32px))",
        maxHeight: "min(480px, calc(100vh - var(--player-height) - 40px))",
        background: "rgba(20,21,32,0.98)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-heavy)",
        zIndex: 60,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Queue</div>
          <div style={{ color: "var(--text-dim)", fontSize: 12 }}>
            {Math.max(visibleQueue.length - Math.max(queueIndex, 0) - 1, 0)} upcoming
          </div>
        </div>
        <button onClick={toggleShowQueue} aria-label="Close queue" style={{ padding: 4 }}>
          <Icon name="x" size={18} />
        </button>
      </div>

      <div style={{ maxHeight: 390, overflowY: "auto", padding: 8 }}>
        {visibleQueue.map((track, index) => {
          const isActive = currentTrack?.id === track.id;
          const isPast = queueIndex > index;

          return (
            <button
              key={`${track.id}-${index}`}
              onClick={() => playTrack(track, visibleQueue)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                minHeight: 58,
                padding: "8px 10px",
                borderRadius: "var(--radius-md)",
                textAlign: "left",
                background: isActive ? "rgba(29,245,118,0.1)" : "transparent",
                color: isPast ? "var(--text-dim)" : "var(--text-primary)",
                opacity: isPast ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ width: 20, color: isActive ? "var(--accent)" : "var(--text-dim)", fontSize: 12 }}>
                {isActive ? <Icon name="music" size={14} /> : index + 1}
              </span>
              <AlbumArt track={track} size={40} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  className="truncate"
                  style={{
                    display: "block",
                    color: isActive ? "var(--accent)" : "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {track.title}
                </span>
                <span className="truncate" style={{ display: "block", color: "var(--text-dim)", fontSize: 12 }}>
                  {track.artist}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
