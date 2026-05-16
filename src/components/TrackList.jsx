import { useState } from "react";
import { usePlayerStore, useLibraryStore } from "../store";
import Icon from "./Icon";
import AlbumArt from "./AlbumArt";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export default function TrackList({ tracks, showIndex = true, compact = false, onPlay, onRemoveTrack }) {
  const { currentTrack, isPlaying, likedIds, playTrack, toggleLike } = usePlayerStore();
  const { playlists, addToPlaylist, addTracks } = useLibraryStore();
  const [openMenuTrackId, setOpenMenuTrackId] = useState(null);

  const handlePlay = (track) => {
    playTrack(track, tracks);
    onPlay?.(track);
  };

  const handleLike = (track) => {
    addTracks([track]);
    toggleLike(track.id);
  };

  const handleAddToPlaylist = (playlistId, track) => {
    addTracks([track]);
    addToPlaylist(playlistId, track.id);
    setOpenMenuTrackId(null);
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-dim)" }}>
        No tracks found
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {tracks.map((track, i) => {
        const isActive = currentTrack?.id === track.id;
        const menuOpen = openMenuTrackId === track.id;

        return (
          <div
            key={track.id}
            onClick={() => handlePlay(track)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: compact ? 10 : 14,
              padding: compact ? "6px 10px" : "8px 12px",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              transition: "background 0.2s",
              background: isActive ? "rgba(29,245,118,0.1)" : "transparent",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}
          >
            {showIndex && (
              <span
                style={{
                  width: 28,
                  fontSize: 13,
                  color: isActive ? "var(--accent)" : "var(--text-dim)",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {isActive && isPlaying ? (
                  <span style={{ display: "inline-flex", gap: 2, alignItems: "flex-end", height: 16 }}>
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        style={{
                          width: 3,
                          background: "var(--accent)",
                          borderRadius: 1,
                          animation: `equalizer 0.8s ease-in-out ${j * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                ) : (
                  i + 1
                )}
              </span>
            )}

            <AlbumArt track={track} size={compact ? 36 : 44} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="truncate"
                style={{
                  fontSize: compact ? 13 : 14,
                  fontWeight: 500,
                  color: isActive ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {track.title}
              </div>
              <div className="truncate" style={{ fontSize: 12, color: "var(--text-dim)" }}>
                {track.artist}
                {!compact && track.album && ` - ${track.album}`}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              {track.source && track.source !== "demo" && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "var(--text-dim)",
                    background: "rgba(255,255,255,0.06)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {track.source === "jamendo"
                    ? "CC"
                    : track.source === "other"
                    ? "Other"
                    : track.source}
                </span>
              )}

              {playlists.length > 0 && (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuTrackId(menuOpen ? null : track.id);
                    }}
                    aria-label="Add to playlist"
                    style={{ padding: 4, color: "var(--text-dim)" }}
                  >
                    <Icon name="plus" size={15} />
                  </button>

                  {menuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 28,
                        width: 210,
                        maxHeight: 260,
                        overflowY: "auto",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "var(--shadow-heavy)",
                        zIndex: 30,
                        padding: 6,
                      }}
                    >
                      <div style={{ padding: "6px 8px", color: "var(--text-dim)", fontSize: 11, fontWeight: 700 }}>
                        Add to playlist
                      </div>
                      {playlists.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => handleAddToPlaylist(playlist.id, track)}
                          style={{
                            width: "100%",
                            display: "block",
                            textAlign: "left",
                            padding: "8px 10px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: 13,
                            color: playlist.trackIds.includes(track.id) ? "var(--accent)" : "var(--text-secondary)",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <span className="truncate" style={{ display: "block" }}>{playlist.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(track);
                }}
                aria-label={likedIds.has(track.id) ? "Unlike track" : "Like track"}
                style={{
                  padding: 4,
                  opacity: likedIds.has(track.id) ? 1 : 0.45,
                  transition: "opacity 0.2s",
                }}
              >
                <Icon
                  name="heart"
                  size={16}
                  fill={likedIds.has(track.id) ? "var(--accent)" : "none"}
                  stroke={likedIds.has(track.id) ? "var(--accent)" : "currentColor"}
                />
              </button>

              {onRemoveTrack && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTrack(track);
                  }}
                  aria-label="Remove from playlist"
                  style={{ padding: 4, color: "var(--text-dim)" }}
                >
                  <Icon name="trash" size={15} />
                </button>
              )}

              <span style={{ fontSize: 12, color: "var(--text-dim)", minWidth: 36, textAlign: "right" }}>
                {fmt(track.duration)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
