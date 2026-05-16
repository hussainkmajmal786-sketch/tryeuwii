import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLibraryStore, usePlayerStore } from "../store";
import Icon from "../components/Icon";
import TrackList from "../components/TrackList";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tracks, playlists, createPlaylist } = useLibraryStore();
  const { likedIds } = usePlayerStore();
  const [showCreate, setShowCreate] = useState(searchParams.get("create") === "1");
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (newName.trim()) {
      createPlaylist(newName.trim());
      setNewName("");
      setShowCreate(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>Your Library</h1>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "var(--bg-hover)",
            borderRadius: "var(--radius-pill)", padding: "8px 16px", fontSize: 13, fontWeight: 600,
          }}
        >
          <Icon name="plus" size={16} /> New Playlist
        </button>
      </div>

      {/* Create Playlist Modal */}
      {showCreate && (
        <div style={{
          background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)",
          padding: 20, marginBottom: 20, border: "1px solid var(--border)",
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Create Playlist</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Playlist name..."
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
              style={{
                flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: "10px 14px", color: "var(--text-primary)",
                fontSize: 14, outline: "none",
              }}
            />
            <button onClick={handleCreate} style={{
              background: "var(--accent)", color: "#000", borderRadius: "var(--radius-md)",
              padding: "10px 20px", fontWeight: 600, fontSize: 14,
            }}>Create</button>
            <button onClick={() => setShowCreate(false)} style={{
              background: "var(--bg-hover)", borderRadius: "var(--radius-md)", padding: "10px 16px", fontSize: 14,
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 16,
      }}>
        {/* Liked Songs Card */}
        <CardItem
          onClick={() => navigate("/liked")}
          gradient="linear-gradient(135deg, #450af5, #1df576)"
          icon={<Icon name="heart" size={40} fill="var(--accent)" stroke="var(--accent)" />}
          title="Liked Songs"
          subtitle={`${likedIds.size} songs`}
        />

        {/* Local Music Card */}
        <CardItem
          onClick={() => navigate("/import")}
          gradient="linear-gradient(135deg, #0f2027, #2c5364)"
          icon={<Icon name="upload" size={40} stroke="rgba(255,255,255,0.7)" />}
          title="Local Music"
          subtitle={`${tracks.filter((t) => t.source === "local").length} songs`}
        />

        {/* User Playlists */}
        {playlists.map((pl) => (
          <CardItem
            key={pl.id}
            onClick={() => navigate(`/playlist/${pl.id}`)}
            gradient={`linear-gradient(135deg, ${pl.color}, #141520)`}
            icon={<Icon name="music" size={40} stroke="rgba(255,255,255,0.7)" />}
            title={pl.name}
            subtitle={`${pl.trackIds.length} songs`}
          />
        ))}
      </div>

      {/* All Tracks */}
      {tracks.length > 0 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "36px 0 16px", letterSpacing: "-0.02em" }}>
            All Tracks ({tracks.length})
          </h2>
          <TrackList tracks={tracks.slice(0, 30)} showIndex={false} />
        </>
      )}
    </div>
  );
}

function CardItem({ onClick, gradient, icon, title, subtitle }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: 10,
        padding: 16,
        cursor: "pointer",
        transition: "all 0.3s",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{
        width: "100%", aspectRatio: "1", borderRadius: 6, background: gradient,
        marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div className="truncate" style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
      <div className="truncate" style={{ fontSize: 12, color: "var(--text-dim)" }}>{subtitle}</div>
    </div>
  );
}
