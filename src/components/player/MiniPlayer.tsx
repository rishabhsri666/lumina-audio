import { Play, Pause, Loader2, AlertCircle } from "lucide-react";

import { usePlayer } from "../../hooks/usePlayer";
import { useUIStore } from "../../store/uiStore";


export default function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    error,
    pause,
    resume,
  } = usePlayer();
const { expandPlayer } = useUIStore();

  return (
    <div
      className="
        h-24
        border-t
        border-white/5
        bg-black/70
        backdrop-blur-2xl
        px-6
        flex
        items-center
        justify-between
      "
    >
      <div
  onClick={expandPlayer}
  className="
    flex
    cursor-pointer
    items-center
    gap-4
    flex-1
  "
>
        {currentTrack?.thumbnail && (
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="
              h-14
              w-14
              rounded-xl
              object-cover
            "
          />
        )}

        <div className="min-w-0">
          <p className="font-medium truncate">
            {currentTrack?.title || "No Track Playing"}
          </p>

          <p className="text-sm text-zinc-400 truncate">
            {error ? (
              <span className="text-red-400 flex items-center gap-1">
                <AlertCircle size={12} />
                {error}
              </span>
            ) : (
              currentTrack?.artist || "Lumina Audio"
            )}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          if (isPlaying) {
            pause();
          } else {
            resume();
          }
        }}
        disabled={error !== null}
        className="
          h-14
          w-14
          rounded-full
          bg-white
          text-black
          flex
          items-center
          justify-center
          shadow-glow
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : isPlaying ? (
          <Pause />
        ) : (
          <Play />
        )}
      </button>
    </div>
  );
}