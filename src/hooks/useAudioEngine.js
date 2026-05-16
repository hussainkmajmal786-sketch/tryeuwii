import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "../store";
import { getDemoAudioUrl } from "../utils/freeMusic";

export function useAudioEngine() {
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setIsPlaying,
    setProgress,
    setDuration,
    nextTrack,
    prevTrack,
  } = usePlayerStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
      audioRef.current.crossOrigin = "anonymous";
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let cancelled = false;

    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      if (usePlayerStore.getState().isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    };

    const onEnded = () => {
      const { repeat } = usePlayerStore.getState();
      if (repeat === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
      } else {
        nextTrack();
      }
    };

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const onError = (event) => {
      console.warn("Audio error:", event);
      nextTrack();
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("error", onError);

    const loadTrack = async () => {
      let src = currentTrack.audioUrl || currentTrack.objectUrl || "";

      if (!src && currentTrack.source === "demo") {
        try {
          src = await getDemoAudioUrl(currentTrack);
        } catch (error) {
          console.warn("Demo audio generation failed:", error);
        }
      }

      if (cancelled) return;

      if (!src) {
        setIsPlaying(false);
        return;
      }

      if (audio.src !== src) {
        audio.src = src;
        audio.load();
      }

      updateMediaSession(currentTrack, {
        play: () => setIsPlaying(true),
        pause: () => setIsPlaying(false),
        previoustrack: () => {
          if (audio.currentTime > 3) {
            audio.currentTime = 0;
            setProgress(0);
          } else {
            prevTrack();
          }
        },
        nexttrack: nextTrack,
        seekto: (details) => {
          if (details.seekTime == null) return;
          audio.currentTime = clampTime(details.seekTime, audio.duration);
          setProgress(audio.currentTime);
        },
      });
    };

    loadTrack();

    return () => {
      cancelled = true;
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("error", onError);
    };
  }, [currentTrack, nextTrack, prevTrack, setDuration, setIsPlaying, setProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.muted = Boolean(isMuted);
  }, [volume, isMuted]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = clampTime(time, audio.duration);
    setProgress(audio.currentTime);
  }, [setProgress]);

  const getAnalyser = useCallback(() => {
    if (analyserRef.current) return analyserRef.current;
    if (!audioRef.current) return null;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      return analyser;
    } catch {
      return null;
    }
  }, []);

  return { audioRef, seek, getAnalyser };
}

function clampTime(time, duration) {
  const fallback = Number.isFinite(time) ? time : 0;
  const max = Number.isFinite(duration) && duration > 0 ? duration : fallback;
  return Math.max(0, Math.min(fallback, max));
}

function updateMediaSession(track, handlers) {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title || "Unknown",
    artist: track.artist || "Unknown Artist",
    album: track.album || "Unknown Album",
    artwork: track.coverUrl
      ? [{ src: track.coverUrl, sizes: "512x512", type: "image/jpeg" }]
      : [],
  });

  Object.entries(handlers).forEach(([action, handler]) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {}
  });
}
