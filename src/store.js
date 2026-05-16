import { create } from "zustand";

const LIKED_KEY = "sw_liked";
const VOLUME_KEY = "sw_volume";
const MUTED_KEY = "sw_muted";
const PLAYLISTS_KEY = "sw_playlists";
const STREAM_TRACKS_KEY = "sw_stream_tracks";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function readNumber(key, fallback) {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function readBoolean(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value == null ? fallback : value === "true";
  } catch {
    return fallback;
  }
}

function normalizePlaylist(playlist) {
  if (!playlist?.id || !playlist?.name) return null;
  return {
    id: String(playlist.id),
    name: String(playlist.name),
    description: playlist.description ? String(playlist.description) : "",
    trackIds: Array.isArray(playlist.trackIds) ? playlist.trackIds.map(String) : [],
    createdAt: Number(playlist.createdAt) || Date.now(),
    color: playlist.color || "hsl(160, 60%, 40%)",
  };
}

function stripRuntimeTrackFields(track) {
  if (!track || track.source === "local" || track.source === "demo" || !track.audioUrl) {
    return null;
  }

  const { objectUrl, fileBlob, ...persistable } = track;
  return persistable;
}

function persistStreamTracks(tracks) {
  const nextById = new Map(readArray(STREAM_TRACKS_KEY).map((track) => [track.id, track]));
  tracks.map(stripRuntimeTrackFields).filter(Boolean).forEach((track) => {
    nextById.set(track.id, track);
  });
  writeArray(STREAM_TRACKS_KEY, [...nextById.values()]);
}

function removePersistedTracks(ids) {
  const removeIds = new Set(ids);
  writeArray(
    STREAM_TRACKS_KEY,
    readArray(STREAM_TRACKS_KEY).filter((track) => !removeIds.has(track.id))
  );
}

function mergeTracks(existingTracks, incomingTracks) {
  const byId = new Map(existingTracks.map((track) => [track.id, track]));

  incomingTracks.filter(Boolean).forEach((track) => {
    const previous = byId.get(track.id);
    byId.set(track.id, previous ? { ...previous, ...track } : track);
  });

  return [...byId.values()];
}

function makePlaylist(name, description = "") {
  const hue = Math.floor((Date.now() / 997) % 360);
  return {
    id: `pl_${Date.now()}`,
    name,
    description,
    trackIds: [],
    createdAt: Date.now(),
    color: `hsl(${hue}, 60%, 40%)`,
  };
}

export const usePlayerStore = create((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: -1,

  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: clamp(readNumber(VOLUME_KEY, 0.75), 0, 1),
  isMuted: readBoolean(MUTED_KEY, false),
  shuffle: false,
  repeat: "off",

  showQueue: false,
  showMobilePlayer: false,

  likedIds: new Set(),

  setCurrentTrack: (track) => set({ currentTrack: track }),

  playTrack: (track, trackList) => {
    const state = get();
    const baseQueue = Array.isArray(trackList) && trackList.length > 0
      ? trackList
      : state.queue.length > 0
        ? state.queue
        : [track];
    const idx = baseQueue.findIndex((t) => t.id === track.id);
    const newQueue = idx >= 0 ? baseQueue : [track, ...baseQueue];

    set({
      currentTrack: track,
      queue: newQueue,
      queueIndex: idx >= 0 ? idx : 0,
      isPlaying: true,
      progress: 0,
    });
  },

  togglePlay: () =>
    set((s) => ({
      isPlaying: s.currentTrack ? !s.isPlaying : false,
    })),
  setIsPlaying: (v) => set({ isPlaying: v }),
  setProgress: (v) => set({ progress: v }),
  setDuration: (v) => set({ duration: v }),

  setVolume: (v) =>
    set(() => {
      const volume = clamp(v, 0, 1);
      try {
        localStorage.setItem(VOLUME_KEY, String(volume));
        localStorage.setItem(MUTED_KEY, "false");
      } catch {}
      return { volume, isMuted: false };
    }),
  toggleMute: () =>
    set((s) => {
      const isMuted = !s.isMuted;
      try {
        localStorage.setItem(MUTED_KEY, String(isMuted));
      } catch {}
      return { isMuted };
    }),

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  cycleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    })),

  nextTrack: () => {
    const { queue, queueIndex, shuffle, repeat } = get();
    if (queue.length === 0) return;

    let nextIdx;
    if (shuffle) {
      if (queue.length === 1) {
        nextIdx = 0;
      } else {
        do {
          nextIdx = Math.floor(Math.random() * queue.length);
        } while (nextIdx === queueIndex);
      }
    } else if (repeat === "one") {
      nextIdx = queueIndex < 0 ? 0 : queueIndex;
    } else {
      if (repeat === "off" && queueIndex >= queue.length - 1) {
        set({ isPlaying: false, progress: 0 });
        return;
      }
      nextIdx = (queueIndex + 1) % queue.length;
    }

    set({
      currentTrack: queue[nextIdx],
      queueIndex: nextIdx,
      progress: 0,
    });
  },

  prevTrack: () => {
    const { queue, queueIndex, progress } = get();
    if (queue.length === 0) return;

    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    const safeIndex = queueIndex < 0 ? 0 : queueIndex;
    const prevIdx = (safeIndex - 1 + queue.length) % queue.length;
    set({
      currentTrack: queue[prevIdx],
      queueIndex: prevIdx,
      progress: 0,
    });
  },

  toggleShowQueue: () => set((s) => ({ showQueue: !s.showQueue })),
  toggleMobilePlayer: () => set((s) => ({ showMobilePlayer: !s.showMobilePlayer })),

  toggleLike: (id) =>
    set((s) => {
      const next = new Set(s.likedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      writeArray(LIKED_KEY, [...next]);
      return { likedIds: next };
    }),

  loadLiked: () => {
    set({ likedIds: new Set(readArray(LIKED_KEY)) });
  },
}));

export const useLibraryStore = create((set) => ({
  tracks: [],
  playlists: [],
  isLoading: false,

  loadLibrary: () => {
    const playlists = readArray(PLAYLISTS_KEY).map(normalizePlaylist).filter(Boolean);
    const streamTracks = readArray(STREAM_TRACKS_KEY);
    set((s) => ({
      playlists,
      tracks: mergeTracks(s.tracks, streamTracks),
    }));
  },

  addTracks: (newTracks) =>
    set((s) => {
      const safeTracks = Array.isArray(newTracks) ? newTracks.filter(Boolean) : [];
      const updated = mergeTracks(s.tracks, safeTracks);
      persistStreamTracks(safeTracks);
      return { tracks: updated };
    }),

  updateTrack: (id, updates) =>
    set((s) => ({
      tracks: s.tracks.map((track) => (track.id === id ? { ...track, ...updates } : track)),
    })),

  removeTracks: (ids) =>
    set((s) => {
      const removeIds = new Set(ids);
      removePersistedTracks(ids);
      const playlists = s.playlists.map((pl) => ({
        ...pl,
        trackIds: pl.trackIds.filter((id) => !removeIds.has(id)),
      }));
      writeArray(PLAYLISTS_KEY, playlists);
      return {
        tracks: s.tracks.filter((t) => !removeIds.has(t.id)),
        playlists,
      };
    }),

  createPlaylist: (name, description = "") => {
    const playlist = makePlaylist(name, description);
    set((s) => {
      const playlists = [...s.playlists, playlist];
      writeArray(PLAYLISTS_KEY, playlists);
      return { playlists };
    });
    return playlist;
  },

  addToPlaylist: (playlistId, trackId) =>
    set((s) => {
      const playlists = s.playlists.map((pl) =>
        pl.id === playlistId && !pl.trackIds.includes(trackId)
          ? { ...pl, trackIds: [...pl.trackIds, trackId] }
          : pl
      );
      writeArray(PLAYLISTS_KEY, playlists);
      return { playlists };
    }),

  removeFromPlaylist: (playlistId, trackId) =>
    set((s) => {
      const playlists = s.playlists.map((pl) =>
        pl.id === playlistId
          ? { ...pl, trackIds: pl.trackIds.filter((id) => id !== trackId) }
          : pl
      );
      writeArray(PLAYLISTS_KEY, playlists);
      return { playlists };
    }),

  deletePlaylist: (id) =>
    set((s) => {
      const playlists = s.playlists.filter((pl) => pl.id !== id);
      writeArray(PLAYLISTS_KEY, playlists);
      return { playlists };
    }),

  setLoading: (v) => set({ isLoading: v }),
}));
