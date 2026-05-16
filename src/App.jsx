import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { usePlayerStore, useLibraryStore } from "./store";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { loadSavedTracks } from "./utils/localFiles";
import { generateDemoTracks, getDemoAudioUrl } from "./utils/freeMusic";
import Sidebar from "./components/Sidebar";
import PlayerBar from "./components/PlayerBar";
import Icon from "./components/Icon";

import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import LibraryPage from "./pages/Library";
import LikedPage from "./pages/Liked";
import ImportPage from "./pages/Import";
import PlaylistPage from "./pages/Playlist";
import SettingsPage from "./pages/Settings";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    currentTrack,
    progress,
    volume,
    loadLiked,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = usePlayerStore();
  const { addTracks, updateTrack, loadLibrary } = useLibraryStore();
  const { seek } = useAudioEngine();

  useEffect(() => {
    let cancelled = false;

    loadLiked();
    loadLibrary();

    loadSavedTracks().then((saved) => {
      if (!cancelled && saved.length > 0) addTracks(saved);
    });

    const demos = generateDemoTracks();
    addTracks(demos);

    demos.slice(0, 3).forEach(async (track) => {
      try {
        const url = await getDemoAudioUrl(track);
        if (!cancelled) updateTrack(track.id, { objectUrl: url });
      } catch {}
    });

    return () => {
      cancelled = true;
    };
  }, [addTracks, loadLibrary, loadLiked, updateTrack]);

  useEffect(() => {
    const isTyping = (target) => {
      const tag = target?.tagName;
      return target?.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    };

    const handleKeyDown = (event) => {
      if (event.repeat || isTyping(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;

      switch (event.key) {
        case " ":
          if (currentTrack) {
            event.preventDefault();
            togglePlay();
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          nextTrack();
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (progress > 3) {
            seek(0);
          } else {
            prevTrack();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          setVolume(volume + 0.05);
          break;
        case "ArrowDown":
          event.preventDefault();
          setVolume(volume - 0.05);
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "s":
        case "S":
          toggleShuffle();
          break;
        case "r":
        case "R":
          cycleRepeat();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentTrack,
    progress,
    volume,
    seek,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  ]);

  const handleSeek = useCallback((time) => {
    seek(time);
  }, [seek]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div
          style={{
            width: 240,
            minWidth: 240,
            background: "var(--bg-secondary)",
            borderRight: "1px solid var(--border)",
            padding: "16px 0",
            overflowY: "auto",
            display: "none",
          }}
          className="desktop-sidebar"
        >
          <Sidebar />
        </div>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 100,
            }}
          />
        )}

        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            width: 260,
            background: "var(--bg-secondary)",
            zIndex: 101,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
            padding: "16px 0",
            overflowY: "auto",
          }}
          aria-hidden={!sidebarOpen}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div
            className="mobile-topbar"
            style={{
              padding: "12px 16px",
              display: "none",
              alignItems: "center",
              gap: 12,
              background: "rgba(13,14,20,0.9)",
              backdropFilter: "blur(12px)",
              zIndex: 20,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <button onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Icon name="menu" size={22} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1df576, #0aad50)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="music" size={12} stroke="#000" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>SoundWave</span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 28px calc(var(--player-height) + 40px)",
              background: "linear-gradient(180deg, #12131a 0%, var(--bg-primary) 400px)",
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/liked" element={<LikedPage />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>

      {currentTrack && <PlayerBar onSeek={handleSeek} />}

      <style>{`
        @media (min-width: 769px) {
          .desktop-sidebar { display: flex !important; flex-direction: column; }
          .mobile-topbar { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
