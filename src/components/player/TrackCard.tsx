import { Play } from "lucide-react";

import type { Track } from "../../types/track";

interface Props {
  track: Track;

  onPlay: () => void;
}

export default function TrackCard({
  track,
  onPlay,
}: Props) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        bg-white/5
        p-4
        transition
        hover:bg-white/10
      "
    >
      <div className="relative">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="
            aspect-square
            w-full
            rounded-2xl
            object-cover
          "
        />

        <button
          onClick={onPlay}
          className="
            absolute
            bottom-4
            right-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-white
            text-black
            opacity-0
            shadow-glow
            transition
            group-hover:opacity-100
          "
        >
          <Play fill="black" />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">
          {track.title}
        </h3>

        <p className="text-sm text-zinc-400">
          {track.artist}
        </p>
      </div>
    </div>
  );
}