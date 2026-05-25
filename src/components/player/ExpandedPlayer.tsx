import {  useMemo, useRef, useState } from "react";

import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";

import { usePlayer } from "../../hooks/usePlayer";

import { useUIStore } from "../../store/uiStore";

import { useQueueStore } from "../../store/queueStore";
//import { audioEngine } from "../../player/audio";

import { formatTime } from "../../utils/formatTime";

import { Heart } from "lucide-react";

import { useLikedSongsStore } from "../../store/likedSongsStore";

import {
  likeSong,
  unlikeSong,
} from "../../services/likedSongsService";

import { useAuthStore } from "../../store/authStore";



// ─────────────────────────────────────────────────────────────────────────────
// Slider
// ─────────────────────────────────────────────────────────────────────────────

interface SliderProps {
  min: number;

  max: number;

  value: number;

  step?: number;

  onChange: (v: number) => void;

  "aria-label"?: string;

  style?: React.CSSProperties;
}

function Slider({
  min,
  max,
  value,
  step = 1,
  onChange,
  "aria-label": label,
  style,
}: SliderProps) {
  const pct =
    max > 0
      ? Math.min(
        100,
        ((value - min) / (max - min)) * 100
      )
      : 0;

  return (
    <div
      style={{
        position: "relative",

        display: "flex",

        alignItems: "center",

        height: 44,

        ...style,
      }}
    >
      {/* track */}
      <div
        style={{
          position: "absolute",

          left: 0,

          right: 0,

          height: 4,

          borderRadius: 999,

          background:
            "rgba(255,255,255,0.15)",
        }}
      />

      {/* fill */}
      <div
        style={{
          position: "absolute",

          left: 0,

          width: `${pct}%`,

          height: 4,

          borderRadius: 999,

          background: "#fff",

          pointerEvents: "none",
        }}
      />

      {/* thumb */}
      <div
        style={{
          position: "absolute",

          left: `calc(${pct}% - 8px)`,

          width: 16,

          height: 16,

          borderRadius: "50%",

          background: "#fff",

          boxShadow:
            "0 2px 6px rgba(0,0,0,0.4)",

          pointerEvents: "none",
        }}
      />

      {/* native input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        style={{
          position: "absolute",

          inset: 0,

          width: "100%",

          height: "100%",

          opacity: 0,

          margin: 0,

          cursor: "pointer",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExpandedPlayer
// ─────────────────────────────────────────────────────────────────────────────

export default function ExpandedPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,

    pause,
    resume,
    seek,
    setVolume,

    playTrack,
  } = usePlayer();

  const { collapsePlayer } =
    useUIStore();

  const queueStore = useQueueStore();

  const {
    isLiked,
    addLikedSong,
    removeLikedSong,
  } = useLikedSongsStore();

  const { user } =
    useAuthStore();

  // ───────────────────────────────────────────────────────────────────────────
  // Responsive Detection
  // ───────────────────────────────────────────────────────────────────────────

  const isDesktop =
    window.innerWidth >= 1024;

  const isLandscape = window.matchMedia(
    "(orientation: landscape)"
  ).matches;



  // ───────────────────────────────────────────────────────────────────────────
  // Swipe Down Gesture
  // ───────────────────────────────────────────────────────────────────────────

  const touchStartY =
    useRef<number | null>(null);

  const [dragY, setDragY] = useState(0);

  const [dragging, setDragging] =
    useState(false);

  const onTouchStart = (
    e: React.TouchEvent
  ) => {
    touchStartY.current =
      e.touches[0].clientY;

    setDragging(true);
  };

  const onTouchMove = (
    e: React.TouchEvent
  ) => {
    if (touchStartY.current === null)
      return;

    const d =
      e.touches[0].clientY -
      touchStartY.current;

    if (d > 0) {
      setDragY(d);
    }
  };

  const onTouchEnd = () => {
    if (dragY > 110) {
      collapsePlayer();
    }

    setDragY(0);

    setDragging(false);

    touchStartY.current = null;
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Track
  // ───────────────────────────────────────────────────────────────────────────


  const handleNext = async () => {
    const next = queueStore.nextTrack();

    if (!next) return;

    await playTrack(
      next,
      queueStore.queue
    );
  };

  const handlePrev = async () => {
    const prev =
      queueStore.previousTrack();

    if (!prev) return;

    await playTrack(
      prev,
      queueStore.queue
    );
  };

  const isMuted = volume === 0;

  const handleToggleLike =
    async () => {
      if (
        !currentTrack ||
        !user
      ) {
        return;
      }

      const liked =
        isLiked(
          currentTrack.id
        );

      try {
        if (liked) {
          removeLikedSong(
            currentTrack.id
          );

          await unlikeSong(
            user.uid,
            currentTrack.id
          );
        } else {
          addLikedSong(
            currentTrack
          );

          await likeSong(
            user.uid,
            currentTrack
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  // ───────────────────────────────────────────────────────────────────────────
  // Artwork Size
  // ───────────────────────────────────────────────────────────────────────────

  const artworkWidth = useMemo(() => {
    if (isDesktop) {
      return "min(34vw, 480px)";
    }

    if (isLandscape) {
      return "min(42vw, 280px)";
    }

    return "min(72vw, 300px)";
  }, [isDesktop, isLandscape]);

  if (!currentTrack) return null;


  // ───────────────────────────────────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: "fixed",

        inset: 0,

        zIndex: 50,

        overflow: "hidden",

        background: "#000",

        color: "#fff",

        userSelect: "none",

        transform: `translateY(${dragY}px)`,

        transition: dragging
          ? "none"
          : "transform 0.35s cubic-bezier(0.32,0.72,0,1)",

        display: "flex",

        flexDirection: "column",
      }}
    >
      {/* background */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          backgroundImage: `url(${currentTrack.thumbnail})`,

          backgroundSize: "cover",

          backgroundPosition: "center",

          filter: "blur(60px)",

          transform: "scale(1.3)",

          opacity: 0.3,
        }}
      />

      {/* overlay */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          background:
            "rgba(0,0,0,0.75)",

          backdropFilter: "blur(30px)",
        }}
      />

      {/* noise texture */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          opacity: 0.03,

          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* content */}
      <div
        style={{
          position: "relative",

          zIndex: 10,

          flex: 1,

          display: "flex",

          flexDirection: isDesktop
            ? "row"
            : "column",

          alignItems: "center",

          justifyContent: isDesktop
            ? "center"
            : "flex-start",

          width: "100%",

          maxWidth: 1280,

          margin: "0 auto",

          padding: isDesktop
            ? "40px"
            : "0 24px",

          gap: isDesktop ? 72 : 0,

          boxSizing: "border-box",

          paddingBottom:
            "env(safe-area-inset-bottom, 16px)",
        }}
      >
        {/* mobile top */}
        {!isDesktop && (
          <>
            {/* handle */}
            <div
              style={{
                position: "absolute",

                top: 12,

                left: "50%",

                transform:
                  "translateX(-50%)",

                width: 36,

                height: 4,

                borderRadius: 999,

                background:
                  "rgba(255,255,255,0.25)",
              }}
            />

            {/* header */}
            <div
              style={{
                position: "absolute",

                top: 18,

                left: 24,

                right: 24,

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "space-between",
              }}
            >
              <button
                onClick={collapsePlayer}
                style={{
                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "center",

                  width: 40,

                  height: 40,

                  borderRadius: "50%",

                  border: "none",

                  background:
                    "rgba(255,255,255,0.08)",

                  color:
                    "rgba(255,255,255,0.7)",

                  cursor: "pointer",
                }}
              >
                <ChevronDown size={22} />
              </button>

              <span
                style={{
                  fontSize: 11,

                  fontWeight: 700,

                  letterSpacing:
                    "0.28em",

                  textTransform:
                    "uppercase",

                  color:
                    "rgba(255,255,255,0.45)",
                }}
              >
                Now Playing
              </span>

              <div style={{ width: 40 }} />
            </div>
          </>
        )}

        {/* artwork */}
        <div
          style={{
            flex: isDesktop ? 0.9 : 1,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            width: "100%",

            minHeight: 0,

            paddingTop: isDesktop
              ? 0
              : 42,

            paddingBottom: isDesktop
              ? 0
              : 10,
          }}
        >
          <div
            style={{
              position: "relative",

              width: artworkWidth,

              maxWidth: 520,
            }}
          >
            {/* glow */}
            <div
              style={{
                position: "absolute",

                inset: 0,

                borderRadius: 36,

                backgroundImage: `url(${currentTrack.thumbnail})`,

                backgroundSize: "cover",

                backgroundPosition:
                  "center",

                filter: "blur(32px)",

                transform:
                  "scale(0.88) translateY(18px)",

                opacity: 0.75,
              }}
            />

            {/* image */}
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              draggable={false}
              style={{
                position: "relative",

                display: "block",

                width: "100%",

                aspectRatio: "1/1",

                objectFit: "cover",

                borderRadius: 36,

                boxShadow:
                  "0 12px 42px rgba(0,0,0,0.55)",

                transition:
                  "transform 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* right side */}
        <div
          style={{
            width: "100%",

            maxWidth: isDesktop
              ? 520
              : "100%",

            display: "flex",

            flexDirection: "column",

            justifyContent: "center",
          }}
        >
          {/* desktop header */}
          {isDesktop && (
            <div
              style={{
                display: "flex",

                alignItems: "center",

                justifyContent:
                  "space-between",

                marginBottom: 28,
              }}
            >
              <button
                onClick={collapsePlayer}
                style={{
                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "center",

                  width: 44,

                  height: 44,

                  borderRadius: "50%",

                  border: "none",

                  background:
                    "rgba(255,255,255,0.08)",

                  color:
                    "rgba(255,255,255,0.7)",

                  cursor: "pointer",
                }}
              >
                <ChevronDown size={24} />
              </button>

              <span
                style={{
                  fontSize: 11,

                  fontWeight: 700,

                  letterSpacing:
                    "0.28em",

                  textTransform:
                    "uppercase",

                  color:
                    "rgba(255,255,255,0.45)",
                }}
              >
                Now Playing
              </span>

              <div style={{ width: 44 }} />
            </div>
          )}

          {/* song info */}
          <div>
            <p
              style={{
                margin: 0,

                fontSize:
                  "clamp(24px, 4vw, 52px)",

                fontWeight: 800,

                lineHeight: 1.1,

                letterSpacing: "-0.03em",

                display: "-webkit-box",

                WebkitLineClamp: 2,

                WebkitBoxOrient:
                  "vertical",

                overflow: "hidden",
              }}
            >
              {currentTrack.title}
            </p>

            <p
              style={{
                margin: "10px 0 0",

                fontSize:
                  "clamp(14px, 2vw, 20px)",

                color:
                  "rgba(255,255,255,0.55)",

                overflow: "hidden",

                whiteSpace: "nowrap",

                textOverflow: "ellipsis",
              }}
            >
              {currentTrack.artist}
            </p>
          </div>

          {/* seek */}
          <div
            style={{
              marginTop: 28,
            }}
          >
            <Slider
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={seek}
              aria-label="Seek"
            />

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                fontSize: 12,

                color:
                  "rgba(255,255,255,0.4)",

                marginTop: 2,

                fontVariantNumeric:
                  "tabular-nums",
              }}
            >
              <span>
                {formatTime(currentTime)}
              </span>

              <span>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* controls */}
          <div
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",

              gap: isDesktop ? 42 : 36,

              marginTop: isDesktop
                ? 32
                : 22,
            }}
          >
            <button
              onClick={handlePrev}
              style={{
                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                width: 54,

                height: 54,

                border: "none",

                background: "none",

                color:
                  "rgba(255,255,255,0.7)",

                cursor: "pointer",

                borderRadius: "50%",
              }}
            >
              <SkipBack size={32} />
            </button>

            <button
              onClick={
                handleToggleLike
              }
              style={{
                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                width: 54,

                height: 54,

                border: "none",

                background: "none",

                color:
                  isLiked(
                    currentTrack.id
                  )
                    ? "#ff4d6d"
                    : "rgba(255,255,255,0.7)",

                cursor: "pointer",

                borderRadius: "50%",

                transition:
                  "all 0.2s ease",
              }}
            >
              <Heart
                size={28}
                fill={
                  isLiked(
                    currentTrack.id
                  )
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            <button
              onClick={() =>
                isPlaying
                  ? pause()
                  : resume()
              }
              style={{
                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                width: isDesktop
                  ? 86
                  : 74,

                height: isDesktop
                  ? 86
                  : 74,

                borderRadius: "50%",

                background: "#fff",

                border: "none",

                color: "#000",

                cursor: "pointer",

                boxShadow:
                  "0 6px 28px rgba(0,0,0,0.5)",
              }}
            >
              {isPlaying ? (
                <Pause size={34} />
              ) : (
                <Play
                  size={34}
                  fill="black"
                />
              )}
            </button>

            <button
              onClick={handleNext}
              style={{
                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                width: 54,

                height: 54,

                border: "none",

                background: "none",

                color:
                  "rgba(255,255,255,0.7)",

                cursor: "pointer",

                borderRadius: "50%",
              }}
            >
              <SkipForward size={32} />
            </button>
          </div>

          {/* volume desktop */}
          {isDesktop && (
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: 12,

                marginTop: 30,
              }}
            >
              <button
                onClick={() =>
                  setVolume(
                    isMuted ? 0.7 : 0
                  )
                }
                style={{
                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "center",

                  width: 36,

                  height: 36,

                  border: "none",

                  background: "none",

                  color:
                    "rgba(255,255,255,0.45)",

                  cursor: "pointer",
                }}
              >
                {isMuted ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>

              <Slider
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={setVolume}
                aria-label="Volume"
                style={{ flex: 1 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}