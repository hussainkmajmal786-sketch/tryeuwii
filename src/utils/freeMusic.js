/**
 * Free Music Sources
 * 
 * Integrates with APIs that provide free, legal music:
 * 1. Jamendo API - CC-licensed music (requires free API key)
 * 2. Built-in demo tracks using Web Audio API
 * 
 * To use Jamendo: Sign up at https://devportal.jamendo.com/
 * and set VITE_JAMENDO_CLIENT_ID in your .env file
 */

const JAMENDO_BASE = "https://api.jamendo.com/v3.0";
const JAMENDO_CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || "";
const JAMENDO_KEY_STORAGE = "sw_jamendo_key";

export function getJamendoClientId() {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return JAMENDO_CLIENT_ID;
  }
  try {
    const storedKey = localStorage.getItem(JAMENDO_KEY_STORAGE);
    return storedKey ? storedKey.trim() : JAMENDO_CLIENT_ID;
  } catch {
    return JAMENDO_CLIENT_ID;
  }
}

export function setJamendoClientId(key) {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;
  try {
    localStorage.setItem(JAMENDO_KEY_STORAGE, key.trim());
  } catch {}
}

export function clearJamendoClientId() {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;
  try {
    localStorage.removeItem(JAMENDO_KEY_STORAGE);
  } catch {}
}

export function hasJamendoKey() {
  return Boolean(getJamendoClientId());
}

export async function validateJamendoClientId(key) {
  if (!key) return false;
  try {
    const params = new URLSearchParams({
      client_id: key.trim(),
      format: "json",
      limit: "1",
      search: "test",
    });
    const res = await fetch(`${JAMENDO_BASE}/tracks/?${params}`);
    const data = await res.json();
    return !data.errors && Array.isArray(data.results);
  } catch {
    return false;
  }
}

// ─── Jamendo API ─────────────────────────────────────────────────────────────

/**
 * Search tracks on Jamendo
 */
export async function searchJamendo(query, limit = 20) {
  const clientId = getJamendoClientId();
  if (!clientId) return [];
  try {
    const params = new URLSearchParams({
      client_id: clientId,
      format: "json",
      limit: String(limit),
      search: query,
      include: "musicinfo",
      audioformat: "mp32",
    });
    const res = await fetch(`${JAMENDO_BASE}/tracks/?${params}`);
    const data = await res.json();
    return (data.results || []).map(mapJamendoTrack);
  } catch (err) {
    console.warn("Jamendo search failed:", err);
    return [];
  }
}

/**
 * Get popular/trending tracks from Jamendo
 */
export async function getPopularJamendo(limit = 30) {
  const clientId = getJamendoClientId();
  if (!clientId) return [];
  try {
    const params = new URLSearchParams({
      client_id: clientId,
      format: "json",
      limit: String(limit),
      order: "popularity_week",
      include: "musicinfo",
      audioformat: "mp32",
    });
    const res = await fetch(`${JAMENDO_BASE}/tracks/?${params}`);
    const data = await res.json();
    return (data.results || []).map(mapJamendoTrack);
  } catch (err) {
    console.warn("Jamendo popular failed:", err);
    return [];
  }
}

/**
 * Get tracks by genre/tag from Jamendo
 */
export async function getByGenreJamendo(genre, limit = 20) {
  const clientId = getJamendoClientId();
  if (!clientId) return [];
  try {
    const params = new URLSearchParams({
      client_id: clientId,
      format: "json",
      limit: String(limit),
      tags: genre.toLowerCase(),
      include: "musicinfo",
      audioformat: "mp32",
    });
    const res = await fetch(`${JAMENDO_BASE}/tracks/?${params}`);
    const data = await res.json();
    return (data.results || []).map(mapJamendoTrack);
  } catch {
    return [];
  }
}

/**
 * Map Jamendo API response to our track format
 */
function mapJamendoTrack(j) {
  return {
    id: `jamendo_${j.id}`,
    title: j.name,
    artist: j.artist_name,
    album: j.album_name || "Single",
    duration: j.duration || 0,
    audioUrl: j.audio || j.audiodownload,
    coverUrl: j.album_image || j.image,
    source: "jamendo",
    license: j.license_ccurl || "CC",
    plays: j.stats?.rate_listened_total || 0,
    genre: j.musicinfo?.tags?.genres?.[0] || "Unknown",
    jamendoUrl: j.shareurl,
  };
}

const demoAudioCache = new Map();

/**
 * Generate demo tracks with synthesized audio for testing.
 * These use the Web Audio API to create simple tones/beats.
 */
export function generateDemoTracks() {
  const tracks = [
    { title: "Celestial Drift", artist: "Luna Waves", genre: "Ambient", bpm: 80, key: "C" },
    { title: "Neon Pulse", artist: "Neon Drift", genre: "Electronic", bpm: 128, key: "E" },
    { title: "Midnight Ocean", artist: "Crystal Depths", genre: "Lo-Fi", bpm: 85, key: "Am" },
    { title: "Electric Dreams", artist: "Solar Flare", genre: "Synthwave", bpm: 120, key: "F" },
    { title: "Fading Light", artist: "Echo Chamber", genre: "Indie", bpm: 95, key: "G" },
    { title: "Golden Hour", artist: "Aura Bloom", genre: "Pop", bpm: 110, key: "D" },
    { title: "Velvet Shadows", artist: "Midnight Reverie", genre: "Jazz", bpm: 75, key: "Bb" },
    { title: "Aurora", artist: "Violet Haze", genre: "Classical", bpm: 60, key: "A" },
    { title: "Weightless", artist: "Oceanic", genre: "Ambient", bpm: 70, key: "Eb" },
    { title: "Infinite Loop", artist: "Phantom Keys", genre: "Electronic", bpm: 135, key: "B" },
    { title: "Crystal Rain", artist: "The Velvet Signal", genre: "R&B", bpm: 90, key: "Dm" },
    { title: "Solar Wind", artist: "Stellar Pulse", genre: "Rock", bpm: 140, key: "E" },
  ];

  return tracks.map((t, i) => ({
    id: `demo_${i}`,
    title: t.title,
    artist: t.artist,
    album: "SoundWave Demos",
    duration: 36 + (i % 5) * 6,
    audioUrl: null,
    objectUrl: null,
    coverUrl: null,
    source: "demo",
    genre: t.genre,
    bpm: t.bpm,
    plays: 24000 + i * 7319,
    addedAt: 0,
  }));
}

export async function getDemoAudioUrl(track) {
  const key = track?.id || `${track?.title || "demo"}_${track?.bpm || 120}`;

  if (!demoAudioCache.has(key)) {
    const promise = createSynthesizedDemoAudio(track).catch((error) => {
      demoAudioCache.delete(key);
      throw error;
    });
    demoAudioCache.set(key, promise);
  }

  return demoAudioCache.get(key);
}

/**
 * Create a synthesized audio blob for a demo track
 */
export async function synthesizeDemoAudio(track) {
  return getDemoAudioUrl(track);
}

async function createSynthesizedDemoAudio(track) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = track.duration || 30;
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
  
  const noteFreqs = {
    C: 261.63, D: 293.66, E: 329.63, F: 349.23,
    G: 392.00, A: 440.00, B: 493.88, Bb: 466.16,
    Am: 440.00, Dm: 293.66, Eb: 311.13,
  };

  const freq = noteFreqs[track.bpm > 100 ? "E" : "C"] || 261.63;
  const bpm = track.bpm || 120;
  const beatDuration = 60 / bpm;

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const beat = Math.floor(t / beatDuration);
      const beatPhase = (t % beatDuration) / beatDuration;
      
      // Simple synth pad
      let sample = 0;
      sample += Math.sin(2 * Math.PI * freq * t) * 0.15;
      sample += Math.sin(2 * Math.PI * freq * 1.5 * t) * 0.08;
      sample += Math.sin(2 * Math.PI * freq * 2 * t) * 0.05;
      
      // Gentle envelope per beat
      const env = Math.exp(-beatPhase * 3) * 0.7 + 0.3;
      sample *= env;
      
      // Fade in/out
      const fadeIn = Math.min(1, t / 2);
      const fadeOut = Math.min(1, (duration - t) / 2);
      sample *= fadeIn * fadeOut * 0.3;
      
      // Slight stereo variation
      if (channel === 1) {
        sample += Math.sin(2 * Math.PI * freq * 0.998 * t) * 0.02;
      }
      
      data[i] = sample;
    }
  }

  // Convert AudioBuffer to WAV blob
  const wavBlob = audioBufferToWav(buffer);
  const url = URL.createObjectURL(wavBlob);
  await ctx.close();
  return url;
}

/**
 * Convert AudioBuffer to WAV format
 */
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave channels
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
