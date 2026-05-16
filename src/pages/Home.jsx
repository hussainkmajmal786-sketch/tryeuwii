import { useNavigate } from "react-router-dom";
import { usePlayerStore, useLibraryStore } from "../store";
import TrackList from "../components/TrackList";
import Icon from "../components/Icon";

const MOODS = ["Chill Vibes", "Workout Energy", "Focus Flow", "Late Night", "Road Trip", "Rainy Day", "Party Mode", "Morning Coffee"];
const MOOD_COLORS = [
  "linear-gradient(135deg, #1a1a2e, #16213e)",
  "linear-gradient(135deg, #0B486B, #F56217)",
  "linear-gradient(135deg, #2d1b69, #11998e)",
  "linear-gradient(135deg, #0f0c29, #302b63)",
  "linear-gradient(135deg, #141e30, #243b55)",
  "linear-gradient(135deg, #1f1c2c, #928DAB)",
  "linear-gradient(135deg, #3a1c71, #d76d77)",
  "linear-gradient(135deg, #232526, #414345)",
];

export default function HomePage() {
  const navigate = useNavigate();
  const { tracks, playlists } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const recentTracks = tracks.slice(0, 10);

  return (
    <div className="fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.03em" }}>
          {greeting}
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>Pick up where you left off</p>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 10,
        marginBottom: 36,
      }}>
        <QuickCard label="Liked Songs" icon="heart" color="linear-gradient(135deg, #450af5, #1df576)" onClick={() => navigate("/liked")} />
        <QuickCard label="Import Music" icon="upload" color="linear-gradient(135deg, #0f2027, #2c5364)" onClick={() => navigate("/import")} />
        <QuickCard label="Search" icon="search" color="linear-gradient(135deg, #2d1b69, #11998e)" onClick={() => navigate("/search")} />
        {playlists.slice(0, 3).map((pl) => (
          <QuickCard key={pl.id} label={pl.name} icon="music" color={`linear-gradient(135deg, ${pl.color}, #141520)`} onClick={() => navigate(`/playlist/${pl.id}`)} />
        ))}
      </div>

      {/* Browse by Mood */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.02em" }}>
        Browse by Mood
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 12,
        marginBottom: 36,
      }}>
        {MOODS.map((mood, i) => (
          <div
            key={mood}
            onClick={() => navigate(`/search?q=${encodeURIComponent(mood)}`)}
            style={{
              background: MOOD_COLORS[i],
              borderRadius: 10,
              padding: "24px 16px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {mood}
          </div>
        ))}
      </div>

      {/* Your Music */}
      {recentTracks.length > 0 && (
        <>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Your Music
          </h2>
          <TrackList tracks={recentTracks} showIndex={false} />
        </>
      )}

      {tracks.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Icon name="music" size={48} stroke="var(--text-dim)" />
          <h3 style={{ marginTop: 16, fontWeight: 600 }}>Your library is empty</h3>
          <p style={{ color: "var(--text-dim)", marginTop: 8, fontSize: 14 }}>
            Import your music files or connect a free music source to get started
          </p>
          <button
            onClick={() => navigate("/import")}
            style={{
              marginTop: 20,
              background: "var(--accent)",
              color: "#000",
              borderRadius: "var(--radius-pill)",
              padding: "12px 32px",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Import Music
          </button>
        </div>
      )}
    </div>
  );
}

function QuickCard({ label, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "var(--bg-hover)",
        borderRadius: 6,
        cursor: "pointer",
        overflow: "hidden",
        transition: "background 0.2s",
        height: 56,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-active)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
    >
      <div style={{ width: 56, height: 56, background: color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={20} stroke="rgba(255,255,255,0.8)" />
      </div>
      <span className="truncate" style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
    </div>
  );
}
