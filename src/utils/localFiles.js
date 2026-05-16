/**
 * Local music file importer.
 * Reads audio files from the user's device, extracts metadata (title, artist,
 * album, cover art), creates blob URLs for playback, and stores references
 * in IndexedDB so the library persists across sessions.
 */

import { get, set, del, keys } from "idb-keyval";

const SUPPORTED_TYPES = [
  "audio/mpeg",         // .mp3
  "audio/mp4",          // .m4a
  "audio/ogg",          // .ogg
  "audio/wav",          // .wav
  "audio/webm",         // .webm
  "audio/flac",         // .flac
  "audio/aac",          // .aac
  "audio/x-m4a",        // .m4a alt
];

const SUPPORTED_EXTENSIONS = [".mp3", ".m4a", ".ogg", ".wav", ".webm", ".flac", ".aac", ".opus"];

/**
 * Check if a file is a supported audio type
 */
export function isAudioFile(file) {
  if (SUPPORTED_TYPES.includes(file.type)) return true;
  const ext = "." + file.name.split(".").pop().toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * Import audio files and return track objects
 */
export async function importAudioFiles(fileList) {
  const files = Array.from(fileList).filter(isAudioFile);
  const tracks = [];

  for (const file of files) {
    try {
      const track = await processAudioFile(file);
      if (track) tracks.push(track);
    } catch (err) {
      console.warn(`Failed to process ${file.name}:`, err);
    }
  }

  return tracks;
}

/**
 * Process a single audio file into a track object
 */
async function processAudioFile(file) {
  const id = `local_${file.name}_${file.size}_${file.lastModified}`;
  
  // Create object URL for playback
  const objectUrl = URL.createObjectURL(file);

  // Try to extract metadata
  let metadata = {
    title: cleanFilename(file.name),
    artist: "Unknown Artist",
    album: "Local Library",
    duration: 0,
    coverUrl: null,
  };

  try {
    const mm = await import("music-metadata");
    const parsed = await mm.parseBlob(file);

    if (parsed.common.title) metadata.title = parsed.common.title;
    if (parsed.common.artist) metadata.artist = parsed.common.artist;
    if (parsed.common.album) metadata.album = parsed.common.album;
    if (parsed.format.duration) metadata.duration = parsed.format.duration;

    // Extract cover art
    if (parsed.common.picture && parsed.common.picture.length > 0) {
      const pic = parsed.common.picture[0];
      const blob = new Blob([pic.data], { type: pic.format });
      metadata.coverUrl = URL.createObjectURL(blob);
    }
  } catch {
    // Fallback: get duration from Audio element
    metadata.duration = await getAudioDuration(objectUrl);
  }

  const track = {
    id,
    title: metadata.title,
    artist: metadata.artist,
    album: metadata.album,
    duration: metadata.duration,
    coverUrl: metadata.coverUrl,
    objectUrl,
    source: "local",
    fileSize: file.size,
    fileName: file.name,
    addedAt: Date.now(),
  };

  // Store file in IndexedDB for persistence
  try {
    await set(`track_${id}`, {
      ...track,
      objectUrl: undefined,
      coverUrl: undefined,
      fileBlob: file,
    });
  } catch (err) {
    console.warn("IndexedDB storage failed:", err);
  }

  return track;
}

/**
 * Get audio duration using HTMLAudioElement
 */
function getAudioDuration(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration || 0);
    });
    audio.addEventListener("error", () => resolve(0));
    audio.src = url;
  });
}

/**
 * Load saved tracks from IndexedDB
 */
export async function loadSavedTracks() {
  try {
    const allKeys = await keys();
    const trackKeys = allKeys.filter((k) => typeof k === "string" && k.startsWith("track_"));
    const tracks = [];

    for (const key of trackKeys) {
      try {
        const stored = await get(key);
        if (stored && stored.fileBlob) {
          const objectUrl = URL.createObjectURL(stored.fileBlob);
          let coverUrl = null;

          // Re-extract cover if needed
          try {
            const mm = await import("music-metadata");
            const parsed = await mm.parseBlob(stored.fileBlob);
            if (parsed.common.picture?.[0]) {
              const pic = parsed.common.picture[0];
              coverUrl = URL.createObjectURL(new Blob([pic.data], { type: pic.format }));
            }
          } catch {}

          tracks.push({
            ...stored,
            objectUrl,
            coverUrl,
            fileBlob: undefined,
          });
        }
      } catch {}
    }

    return tracks;
  } catch {
    return [];
  }
}

/**
 * Remove a track from IndexedDB
 */
export async function removeTrack(trackId) {
  try {
    await del(`track_${trackId}`);
  } catch {}
}

/**
 * Clean a filename into a readable title
 */
function cleanFilename(name) {
  return name
    .replace(/\.[^.]+$/, "")          // Remove extension
    .replace(/[-_]/g, " ")            // Replace dashes/underscores
    .replace(/\s+/g, " ")             // Collapse spaces
    .replace(/^\d+\s*[-.]?\s*/, "")   // Remove leading track numbers
    .trim();
}

/**
 * Get total storage usage
 */
export async function getStorageUsage() {
  if (navigator.storage && navigator.storage.estimate) {
    const est = await navigator.storage.estimate();
    return {
      used: est.usage || 0,
      quota: est.quota || 0,
      percent: est.quota ? ((est.usage || 0) / est.quota) * 100 : 0,
    };
  }
  return { used: 0, quota: 0, percent: 0 };
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
