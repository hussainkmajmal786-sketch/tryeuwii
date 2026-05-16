import { useState, useCallback, useRef } from "react";
import { useLibraryStore } from "../store";
import { importAudioFiles, formatBytes } from "../utils/localFiles";
import TrackList from "../components/TrackList";
import Icon from "../components/Icon";

export default function ImportPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const { tracks, addTracks } = useLibraryStore();

  const localTracks = tracks.filter((t) => t.source === "local");

  const handleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    setImporting(true);
    setImportCount(0);

    try {
      const newTracks = await importAudioFiles(files);
      if (newTracks.length > 0) {
        addTracks(newTracks);
        setImportCount(newTracks.length);
        showToast(`Added ${newTracks.length} track${newTracks.length > 1 ? "s" : ""} to your library`);
      } else {
        showToast("No supported audio files found");
      }
    } catch (err) {
      showToast("Import failed: " + err.message);
    }

    setImporting(false);
  }, [addTracks]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files) handleFiles(files);
  }, [handleFiles]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.03em" }}>
        Import Music
      </h1>
      <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 28 }}>
        Add your own music files — MP3, M4A, FLAC, WAV, OGG, and more
      </p>

      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? "active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{ marginBottom: 20 }}
      >
        {importing ? (
          <div>
            <div style={{ animation: "spin 1s linear infinite", display: "inline-block", marginBottom: 12 }}>
              <Icon name="music" size={36} stroke="var(--accent)" />
            </div>
            <p style={{ fontWeight: 600 }}>Importing tracks...</p>
          </div>
        ) : (
          <>
            <Icon name="upload" size={36} stroke={isDragging ? "var(--accent)" : "var(--text-dim)"} />
            <p style={{ fontWeight: 600, marginTop: 12, fontSize: 16 }}>
              Drag & drop audio files here
            </p>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 6 }}>
              or click to browse • MP3, FLAC, WAV, M4A, OGG
            </p>
          </>
        )}
      </div>

      <input ref={fileInputRef} type="file" multiple accept="audio/*" onChange={(e) => handleFiles(e.target.files)} style={{ display: "none" }} />
      <input ref={folderInputRef} type="file" multiple accept="audio/*" onChange={(e) => handleFiles(e.target.files)} style={{ display: "none" }} {...{ webkitdirectory: "", directory: "" }} />

      {/* Import Options */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "var(--accent)",
            color: "#000", borderRadius: "var(--radius-pill)", padding: "10px 24px",
            fontWeight: 600, fontSize: 14, transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          <Icon name="music" size={16} stroke="#000" /> Select Files
        </button>
        <button
          onClick={() => folderInputRef.current?.click()}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "transparent",
            color: "var(--text-primary)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-pill)", padding: "10px 24px",
            fontWeight: 600, fontSize: 14,
          }}
        >
          <Icon name="folder" size={16} /> Select Folder
        </button>
      </div>

      {/* Tips */}
      <div style={{
        background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)",
        padding: 20, marginBottom: 28, border: "1px solid var(--border)",
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: "var(--accent)" }}>
          💡 How it works
        </h3>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Your music files stay on your device and play directly in the browser. 
          Metadata (title, artist, album art) is automatically extracted. 
          Files are cached in your browser for instant playback next time. 
          Nothing is uploaded to any server — 100% private and offline-capable.
        </div>
      </div>

      {/* Imported Tracks */}
      {localTracks.length > 0 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Imported Tracks ({localTracks.length})
          </h2>
          <TrackList tracks={localTracks} />
        </>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
