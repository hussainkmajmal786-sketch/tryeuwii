import { useParams, useNavigate } from "react-router-dom";
import { useLibraryStore, usePlayerStore } from "../store";
import TrackList from "../components/TrackList";
import Icon from "../components/Icon";

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, tracks, deletePlaylist, removeFromPlaylist } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  const playlist = playlists.find((pl) => pl.id === id);

  if (!playlist) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--text-dim)" }}>
        <p>Playlist not found</p>
        <button onClick={() => navigate("/library")} style={{ marginTop: 16, color: "var(--accent)", fontSize: 14 }}>
          Back to Library
        </button>
      </div>
    );
  }

  const playlistTracks = playlist.trackIds
    .map((tid) => tracks.find((t) => t.id === tid))
    .filter(Boolean);

  const handleDelete = () => {
    if (confirm(`Delete "${playlist.name}"?`)) {
      deletePlaylist(id);
      navigate("/library");
    }
  };

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${playlist.color}, #141520)`,
        borderRadius: 12, padding: "32px 24px", marginBottom: 24,
        display: "flex", alignItems: "flex-end", gap: 20, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
        <div style={{
          width: 120, height: 120, borderRadius: 8, background: "rgba(0,0,0,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)", position: "relative",
        }}>
          <Icon name="music" size={48} stroke="rgba(255,255,255,0.7)" />
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, opacity: 0.8 }}>Playlist</div>
          <h1 className="truncate" style={{ fontSize: 32, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.03em" }}>{playlist.name}</h1>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{playlist.description || `${playlistTracks.length} songs`}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
        {playlistTracks.length > 0 && (
          <button
            onClick={() => playTrack(playlistTracks[0], playlistTracks)}
            style={{
              background: "var(--accent)", color: "#000", borderRadius: "var(--radius-pill)",
              padding: "12px 36px", fontWeight: 700, fontSize: 15, transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="play" size={14} /> Play All
            </span>
          </button>
        )}
        <button
          onClick={handleDelete}
          style={{
            display: "flex", alignItems: "center", gap: 6, color: "var(--text-dim)",
            fontSize: 13, padding: "8px 16px", borderRadius: "var(--radius-pill)",
            border: "1px solid var(--border)", transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4757")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
        >
          <Icon name="trash" size={14} /> Delete
        </button>
      </div>

      {/* Track List */}
      {playlistTracks.length > 0 ? (
        <TrackList tracks={playlistTracks} onRemoveTrack={(track) => removeFromPlaylist(id, track.id)} />
      ) : (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
          <p>This playlist is empty</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Add tracks from your library or search</p>
        </div>
      )}
    </div>
  );
}
