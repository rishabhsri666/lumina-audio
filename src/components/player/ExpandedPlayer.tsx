import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

import { usePlayer } from "../../hooks/usePlayer";

import { useUIStore } from "../../store/uiStore";

import { useQueueStore } from "../../store/queueStore";

import { formatTime } from "../../utils/formatTime";

export default function ExpandedPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeat,
    shuffle,
    error,
    isLoading,

    playTrack,
    pause,
    resume,
    seek,
    setVolume,
  } = usePlayer();

  const { collapsePlayer } = useUIStore();

  const queueStore = useQueueStore();

  if (!currentTrack) return null;

  const handleNext = async () => {
    const next = queueStore.nextTrack();

    if (!next?.streamUrl) return;

    await playTrack(next);
  };

  const handlePrevious = async () => {
    const prev = queueStore.previousTrack();

    if (!prev?.streamUrl) return;

    await playTrack(prev);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        flex-col
        bg-black
        bg-ambient
        backdrop-blur-3xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          p-6
        "
      >
        <button onClick={collapsePlayer}>
          <ChevronDown size={32} />
        </button>

        <p className="text-sm text-zinc-400">
          PLAYING NOW
        </p>

        <div className="w-8" />
      </div>

      <div
        className="
          flex
          flex-1
          flex-col
          items-center
          justify-center
          px-8
        "
      >
        <img
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          className="
            aspect-square
            w-full
            max-w-md
            rounded-[2rem]
            object-cover
            shadow-glow
          "
        />

        <div className="mt-10 text-center">
          <h1 className="text-4xl font-bold">
            {currentTrack.title}
          </h1>

          <p className="mt-2 text-xl text-zinc-400">
            {currentTrack.artist}
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-10 w-full max-w-2xl">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) =>
              seek(Number(e.target.value))
            }
            disabled={error !== null}
            className="w-full disabled:opacity-50"
          />

          <div
            className="
              mt-2
              flex
              justify-between
              text-sm
              text-zinc-400
            "
          >
            <span>
              {formatTime(currentTime)}
            </span>

            <span>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div
          className="
            mt-10
            flex
            items-center
            gap-8
          "
        >
          <button disabled={error !== null}>
            <Shuffle
              className={
                shuffle && !error
                  ? "text-accent"
                  : error
                  ? "text-gray-600"
                  : "text-white"
              }
            />
          </button>

          <button onClick={handlePrevious} disabled={error !== null}>
            <SkipBack size={36} className={error ? "text-gray-600" : ""} />
          </button>

          <button
            onClick={() => {
              if (isPlaying) {
                pause();
              } else {
                resume();
              }
            }}
            disabled={error !== null || isLoading}
            className="
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              shadow-glow
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {isPlaying ? (
              <Pause size={40} />
            ) : (
              <Play size={40} />
            )}
          </button>

          <button onClick={handleNext} disabled={error !== null}>
            <SkipForward size={36} className={error ? "text-gray-600" : ""} />
          </button>

          <button disabled={error !== null}>
            <Repeat
              className={
                repeat && !error
                  ? "text-accent"
                  : error
                  ? "text-gray-600"
                  : "text-white"
              }
            />
          </button>
        </div>

        <div className="mt-10 w-full max-w-sm">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) =>
              setVolume(Number(e.target.value))
            }
            disabled={error !== null}
            className="w-full disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
