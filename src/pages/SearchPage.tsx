import { useState } from "react";

import type { FormEvent } from "react";

import TrackCard from "../components/player/TrackCard";

import { searchSongs } from "../api/search";

import type { Track } from "../types/track";

import { usePlayer } from "../hooks/usePlayer";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const [tracks, setTracks] = useState<
    Track[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const { playTrack } = usePlayer();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const results =
        await searchSongs(query);

      setTracks(results);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await handleSearch();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Search
        </h1>

        <p className="mt-3 text-zinc-400">
          Discover music from YouTube.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:flex-row"
      >
        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search songs..."
          className="
            flex-1
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-6
            py-4
            text-white
            outline-none
            focus:border-white/30
            focus:ring-2
            focus:ring-white/20
          "
        />

        <button
          type="submit"
          className="
            rounded-2xl
            bg-white
            px-8
            py-4
            text-black
            font-medium
            transition
            hover:opacity-90
            w-full
            md:w-auto
          "
        >
          Search
        </button>
      </form>

      {loading && (
        <p className="mt-8 text-zinc-400">
          Searching...
        </p>
      )}

      <div
        className="
          mt-10
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onPlay={() =>
              playTrack(track, tracks)
            }
          />
        ))}
      </div>
    </div>
  );
}