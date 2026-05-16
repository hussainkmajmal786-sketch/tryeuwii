import { useRef, useCallback } from "react";
import { usePlayerStore, useLibraryStore } from "../store";
import Icon from "./Icon";
import AlbumArt from "./AlbumArt";
import QueuePanel from "./QueuePanel";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

function Slider({ label, value, max, onChange, accentColor = "var(--accent)", width = "100%" }) {
  const ref = useRef(null);

  const handleInteraction = useCallback((event) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(pct * Math.max(max, 0));
  }, [max, onChange]);

  const handleMouseDown = (event) => {
    handleInteraction(event);
    const onMove = (moveEvent) => handleInteraction(moveEvent);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  return (
    <div
      ref={ref}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(max || 0)}
      aria-valuenow={Math.round(value || 0)}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onTouchStart={handleInteraction}
      onTouchMove={handleInteraction}
      style={{
        width,
        height: 4,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 2,
        cursor: "pointer",
        position: "relative",
        touchAction: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${pct}%`,
          background: accentColor,
          borderRadius: 2,
          transition: "width 0.1s linear",
        }}
      />
      <div
        className="slider-thumb"
        style={{
          position: "absolute",
          top: "50%",
          left: `${pct}%`,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#fff",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          opacity: 0,
          transition: "opacity 0.2s",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function PlayerBar({ onSeek }) {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    showQueue,
    likedIds,
    togglePlay,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    nextTrack,
    prevTrack,
    toggleShowQueue,
    setProgress,
    toggleLike,
  } = usePlayerStore();
  const { addTracks } = useLibraryStore();

  const handleSeek = useCallback((val) => {
    setProgress(val);
    onSeek?.(val);
  }, [onSeek, setProgress]);

  const handleLike = useCallback(() => {
    if (!currentTrack) return;
    addTracks([currentTrack]);
    toggleLike(currentTrack.id);
  }, [addTracks, currentTrack, toggleLike]);

  const handlePrev = useCallback(() => {
    if (progress > 3) {
      handleSeek(0);
    } else {
      prevTrack();
    }
  }, [handleSeek, prevTrack, progress]);

  if (!currentTrack) return null;

  const isLiked = likedIds.has(currentTrack.id);
  const seekMax = duration || currentTrack.duration || 1;

  return (
    <>
      <style>{`
        .player-slider:hover .slider-thumb,
        .player-slider:focus-within .slider-thumb { opacity: 1 !important; }

        @media (max-width: 640px) {
          .player-bar {
            height: var(--player-height) !important;
            align-items: flex-start !important;
            flex-wrap: wrap;
            gap: 8px;
            padding: 10px 12px !important;
          }

          .player-track-info {
            order: 1;
            width: calc(100% - 112px) !important;
            max-width: none !important;
          }

          .player-center-controls {
            order: 3;
            width: 100%;
            flex-basis: 100%;
            max-width: none !important;
          }

          .player-right-controls {
            order: 2;
            width: auto !important;
            max-width: none !important;
            margin-left: auto;
          }

          .player-volume-control {
            display: none !important;
          }
        }
      `}</style>

      {showQueue && <QueuePanel />}

      <div
        className="player-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "var(--player-height)",
          background: "linear-gradient(180deg, rgba(13,14,20,0.97), #0d0e14)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          zIndex: 50,
        }}
      >
        <div
          className="player-track-info"
          style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, width: "30%", maxWidth: 300 }}
        >
          <AlbumArt track={currentTrack} size={48} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="truncate" style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
              {currentTrack.title}
            </div>
            <div className="truncate" style={{ fontSize: 11, color: "var(--text-dim)" }}>
              {currentTrack.artist}
            </div>
          </div>
          <button
            onClick={handleLike}
            aria-label={isLiked ? "Unlike track" : "Like track"}
            style={{ flexShrink: 0, padding: 4 }}
          >
            <Icon
              name="heart"
              size={16}
              fill={isLiked ? "var(--accent)" : "none"}
              stroke={isLiked ? "var(--accent)" : "var(--text-dim)"}
            />
          </button>
        </div>

        <div
          className="player-center-controls"
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, maxWidth: 600, margin: "0 auto" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
              style={{ color: shuffle ? "var(--accent)" : "var(--text-dim)", padding: 4 }}
            >
              <Icon name="shuffle" size={16} />
            </button>
            <button
              data-prev-btn
              onClick={handlePrev}
              aria-label="Previous track"
              style={{ color: "var(--text-primary)", padding: 4 }}
            >
              <Icon name="prev" size={18} />
            </button>
            <button
              data-play-btn
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Icon name={isPlaying ? "pause" : "play"} size={16} />
            </button>
            <button
              data-next-btn
              onClick={nextTrack}
              aria-label="Next track"
              style={{ color: "var(--text-primary)", padding: 4 }}
            >
              <Icon name="next" size={18} />
            </button>
            <button
              onClick={cycleRepeat}
              aria-label="Cycle repeat mode"
              style={{
                color: repeat !== "off" ? "var(--accent)" : "var(--text-dim)",
                padding: 4,
                position: "relative",
              }}
            >
              <Icon name="repeat" size={16} />
              {repeat === "one" && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -4,
                    fontSize: 8,
                    fontWeight: 800,
                    color: "var(--accent)",
                  }}
                >
                  1
                </span>
              )}
            </button>
          </div>
          <div className="player-slider" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 500 }}>
            <span style={{ fontSize: 11, color: "var(--text-dim)", minWidth: 36, textAlign: "right" }}>{fmt(progress)}</span>
            <Slider label="Seek" value={progress} max={seekMax} onChange={handleSeek} />
            <span style={{ fontSize: 11, color: "var(--text-dim)", minWidth: 36 }}>{fmt(seekMax)}</span>
          </div>
        </div>

        <div
          className="player-right-controls"
          style={{ display: "flex", alignItems: "center", gap: 12, width: "20%", maxWidth: 200, justifyContent: "flex-end" }}
        >
          <button
            onClick={toggleShowQueue}
            aria-label="Show queue"
            style={{ color: showQueue ? "var(--accent)" : "var(--text-dim)", padding: 4 }}
          >
            <Icon name="queue" size={18} />
          </button>
          <button onClick={toggleMute} aria-label="Mute" style={{ color: "var(--text-dim)", padding: 4 }}>
            <Icon name={isMuted || volume === 0 ? "mute" : "volume"} size={18} />
          </button>
          <div className="player-slider player-volume-control" style={{ width: 90 }}>
            <Slider label="Volume" value={isMuted ? 0 : volume * 100} max={100} onChange={(v) => setVolume(v / 100)} width="90px" />
          </div>
        </div>
      </div>
    </>
  );
}
