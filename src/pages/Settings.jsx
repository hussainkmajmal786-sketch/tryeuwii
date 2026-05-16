import { useState, useEffect } from "react";
import { getStorageUsage, formatBytes } from "../utils/localFiles";
import { hasJamendoKey } from "../utils/freeMusic";
import Icon from "../components/Icon";

export default function SettingsPage() {
  const [storage, setStorage] = useState({ used: 0, quota: 0, percent: 0 });

  useEffect(() => {
    getStorageUsage().then(setStorage);
  }, []);

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28, letterSpacing: "-0.03em" }}>Settings</h1>

      {/* Music Sources */}
      <Section title="Music Sources">
        <SettingRow
          label="Local Files"
          description="Import MP3, FLAC, WAV, M4A files from your device"
          status="Enabled"
          statusColor="var(--accent)"
        />
        <SettingRow
          label="Jamendo (Free CC Music)"
          description={
            hasJamendoKey()
              ? "Connected — search millions of Creative Commons tracks"
              : "Add your free API key to access millions of CC-licensed tracks"
          }
          status={hasJamendoKey() ? "Connected" : "Not configured"}
          statusColor={hasJamendoKey() ? "var(--accent)" : "var(--text-dim)"}
        />
        {!hasJamendoKey() && (
          <div style={{
            background: "var(--bg-elevated)", borderRadius: "var(--radius-md)",
            padding: 16, marginTop: 8, border: "1px solid var(--border)", fontSize: 13,
            color: "var(--text-secondary)", lineHeight: 1.7,
          }}>
            <strong style={{ color: "var(--accent)" }}>How to enable Jamendo:</strong><br />
            1. Visit <a href="https://devportal.jamendo.com/" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>devportal.jamendo.com</a> and create a free account<br />
            2. Create an app to get your Client ID<br />
            3. Create a <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 3 }}>.env</code> file in the project root:<br />
            <code style={{ display: "block", background: "rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: 4, marginTop: 6 }}>
              VITE_JAMENDO_CLIENT_ID=your_client_id_here
            </code>
          </div>
        )}
      </Section>

      {/* Storage */}
      <Section title="Storage">
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: "var(--text-secondary)" }}>Browser storage used</span>
            <span>{formatBytes(storage.used)} / {formatBytes(storage.quota)}</span>
          </div>
          <div style={{
            height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${Math.min(storage.percent, 100)}%`,
              background: storage.percent > 80 ? "#ff4757" : "var(--accent)",
              borderRadius: 3, transition: "width 0.5s",
            }} />
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-dim)" }}>
          Music files are stored in your browser's IndexedDB for offline access.
          Clear browser data to free up space.
        </p>
      </Section>

      {/* About */}
      <Section title="About SoundWave">
        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          <p><strong>SoundWave</strong> is a free, privacy-first music player.</p>
          <p style={{ marginTop: 8 }}>
            ✓ Play local music files (MP3, FLAC, WAV, M4A, OGG)<br />
            ✓ Stream CC-licensed music via Jamendo<br />
            ✓ Create and manage playlists<br />
            ✓ Works offline as a PWA<br />
            ✓ No ads, no tracking, no account required<br />
            ✓ MediaSession API — control from lock screen<br />
            ✓ Auto-extracts album art and metadata
          </p>
        </div>
      </Section>

      {/* Keyboard Shortcuts */}
      <Section title="Keyboard Shortcuts">
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", fontSize: 13 }}>
          {[
            ["Space", "Play / Pause"],
            ["→", "Next track"],
            ["←", "Previous track"],
            ["↑ / ↓", "Volume up / down"],
            ["M", "Mute / Unmute"],
            ["S", "Toggle shuffle"],
            ["R", "Cycle repeat mode"],
          ].map(([key, desc]) => (
            <KeyRow key={key} shortcut={key} description={desc} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>{title}</h2>
      <div style={{
        background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-lg)",
        padding: 20, border: "1px solid var(--border)",
      }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, description, status, statusColor }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{description}</div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: statusColor }}>{status}</span>
    </div>
  );
}

function KeyRow({ shortcut, description }) {
  return (
    <>
      <kbd style={{
        background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "2px 8px",
        fontSize: 12, fontFamily: "monospace", border: "1px solid var(--border)",
        display: "inline-block", textAlign: "center", minWidth: 40,
      }}>{shortcut}</kbd>
      <span style={{ color: "var(--text-secondary)" }}>{description}</span>
    </>
  );
}
