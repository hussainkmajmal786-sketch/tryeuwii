import { usePlayerStore, useLibraryStore } from "../store";
import TrackList from "../components/TrackList";
import Icon from "../components/Icon";

export default function LikedPage() {
  const { likedIds, playTrack } = usePlayerStore();
  const { tracks } = useLibraryStore();
  const liked = tracks.filter((t) => likedIds.has(t.id));

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #450af5, #1df576)",
        borderRadius: 12, padding: "32px 24px", marginBottom: 24,
        display: "flex", alignItems: "flex-end", gap: 20,
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: 8, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}>
          <Icon name="heart" size={48} fill="var(--accent)" stroke="var(--accent)" />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Playlist</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.03em" }}>Liked Songs</h1>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{liked.length} songs</div>
        </div>
      </div>

      {liked.length > 0 ? (
        <>
          <button
            onClick={() => liked.length > 0 && playTrack(liked[0], liked)}
            style={{
              background: "var(--accent)", color: "#000", borderRadius: "var(--radius-pill)",
              padding: "12px 36px", fontWeight: 700, fontSize: 15, marginBottom: 20,
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="play" size={14} /> Play All
            </span>
          </button>
          <TrackList tracks={liked} />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
          <p>No liked songs yet. Tap the heart on any track!</p>
        </div>
      )}
    </div>
  );
}
