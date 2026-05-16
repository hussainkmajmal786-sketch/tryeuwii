import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLibraryStore } from "../store";
import { searchJamendo, hasJamendoKey } from "../utils/freeMusic";
import TrackList from "../components/TrackList";
import Icon from "../components/Icon";

const GENRES = ["Pop", "Hip-Hop", "Rock", "Electronic", "Jazz", "Classical", "R&B", "Indie", "Lo-Fi", "Ambient"];
const GENRE_COLORS = [
  "linear-gradient(135deg, #e91e63, #9c27b0)",
  "linear-gradient(135deg, #ff6f00, #ff8f00)",
  "linear-gradient(135deg, #d32f2f, #b71c1c)",
  "linear-gradient(135deg, #00bcd4, #0097a7)",
  "linear-gradient(135deg, #5d4037, #795548)",
  "linear-gradient(135deg, #283593, #1565c0)",
  "linear-gradient(135deg, #6a1b9a, #ad1457)",
  "linear-gradient(135deg, #2e7d32, #388e3c)",
  "linear-gradient(135deg, #4a148c, #7b1fa2)",
  "linear-gradient(135deg, #1a237e, #0d47a1)",
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { tracks } = useLibraryStore();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setSearching(true);

      // Search local library
      const q = query.toLowerCase();
      const localResults = tracks.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.artist?.toLowerCase().includes(q) ||
          t.album?.toLowerCase().includes(q) ||
          t.genre?.toLowerCase().includes(q)
      );

      const onlineSearches = [];
      if (hasJamendoKey()) onlineSearches.push(searchJamendo(query, 50));

      try {
        const onlineResults = (await Promise.all(onlineSearches)).flat();
        if (!cancelled) setResults([...localResults, ...onlineResults]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, tracks]);

  return (
    <div className="fade-in">
      {/* Search Bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, paddingBottom: 20, background: "linear-gradient(180deg, #12131a, transparent)" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 28,
          padding: "10px 18px",
          maxWidth: 480,
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <Icon name="search" size={20} stroke="var(--text-secondary)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, genres..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: 15,
              flex: 1,
            }}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <Icon name="x" size={16} stroke="var(--text-secondary)" />
            </button>
          )}
        </div>
      </div>

      {/* Results or Browse */}
      {query.length > 1 ? (
        searching ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
            <div style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
              <Icon name="music" size={24} />
            </div>
            <p style={{ marginTop: 12 }}>Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }}>
              {results.length} result{results.length !== 1 ? "s" : ""} (including CC-licensed full tracks from Jamendo)
            </p>
            <TrackList tracks={results} />
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-dim)" }}>
            <p>No results found for "{query}"</p>
            <p style={{ marginTop: 8, fontSize: 13 }}>
              Try a different spelling or a more general term.
              {!hasJamendoKey() && " Add a Jamendo API key in Settings for CC-licensed full tracks."}
            </p>
          </div>
        )
      ) : (
        <>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Browse Genres
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 12,
          }}>
            {GENRES.map((genre, i) => (
              <div
                key={genre}
                onClick={() => setQuery(genre)}
                style={{
                  background: GENRE_COLORS[i],
                  borderRadius: 10,
                  padding: "28px 16px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {genre}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
