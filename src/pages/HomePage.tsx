import TrackCard from "../components/player/TrackCard";

import { mockTracks } from "../utils/mockTracks";

import { usePlayer } from "../hooks/usePlayer";

export default function HomePage() {
  const { playTrack } = usePlayer();

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1
          className="
            text-6xl
            font-black
            tracking-tight
          "
        >
          Lumina Audio
        </h1>

        <p className="mt-4 text-xl text-zinc-400">
          Immerse yourself in sound.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {mockTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onPlay={() =>
              playTrack(track, mockTracks)
            }
          />
        ))}
      </div>
    </div>
  );
}