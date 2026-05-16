import { useNavigate, useLocation } from "react-router-dom";
import { useLibraryStore } from "../store";
import Icon from "./Icon";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { playlists } = useLibraryStore();

  const nav = (path) => {
    navigate(path);
    onClose?.();
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ icon, label, path }) => (
    <button
      onClick={() => nav(path)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 20px",
        width: "100%",
        color: isActive(path) ? "var(--accent)" : "var(--text-secondary)",
        background: isActive(path) ? "rgba(29,245,118,0.08)" : "transparent",
        borderLeft: isActive(path) ? "3px solid var(--accent)" : "3px solid transparent",
        fontSize: 14,
        fontWeight: isActive(path) ? 600 : 400,
        transition: "all 0.2s",
        textAlign: "left",
      }}
      onMouseEnter={(e) => { if (!isActive(path)) e.currentTarget.style.background = "var(--bg-hover)"; }}
      onMouseLeave={(e) => { if (!isActive(path)) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon name={icon} size={20} />
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* Logo */}
      <div style={{ padding: "4px 20px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #1df576, #0aad50)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="music" size={16} stroke="#000" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: "#fff" }}>
          SoundWave
        </span>
        <span style={{
          fontSize: 10, color: "var(--accent)", fontWeight: 600,
          background: "var(--accent-dim)", padding: "2px 6px", borderRadius: 4,
        }}>FREE</span>
      </div>

      {/* Main Nav */}
      <NavItem icon="home" label="Home" path="/" />
      <NavItem icon="search" label="Search" path="/search" />
      <NavItem icon="library" label="Library" path="/library" />
      <NavItem icon="heart" label="Liked Songs" path="/liked" />
      <NavItem icon="upload" label="Import Music" path="/import" />

      {/* Playlists */}
      <div style={{
        padding: "20px 20px 8px",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--text-dim)",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}>
        Your Playlists
      </div>

      <button
        onClick={() => nav("/library?create=1")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 24px",
          fontSize: 13,
          color: "var(--text-secondary)",
          transition: "color 0.2s",
          textAlign: "left",
          width: "100%",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
      >
        <Icon name="plus" size={14} />
        Create Playlist
      </button>

      {playlists.map((pl) => (
        <button
          key={pl.id}
          onClick={() => nav(`/playlist/${pl.id}`)}
          style={{
            padding: "8px 24px",
            fontSize: 13,
            color: location.pathname === `/playlist/${pl.id}` ? "var(--accent)" : "var(--text-dim)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color 0.2s",
            textAlign: "left",
            width: "100%",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => {
            if (location.pathname !== `/playlist/${pl.id}`) e.currentTarget.style.color = "var(--text-dim)";
          }}
        >
          {pl.name}
        </button>
      ))}

      {/* Bottom spacer */}
      <div style={{ flex: 1 }} />
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => nav("/settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            color: "var(--text-dim)",
            padding: "8px 0",
          }}
        >
          <Icon name="settings" size={16} />
          Settings
        </button>
      </div>
    </div>
  );
}
