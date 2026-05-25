import { History } from "lucide-react";

import { useRecentlyPlayedStore } from "../store/recentlyPlayedStore";

import { usePlayer } from "../hooks/usePlayer";

export default function RecentlyPlayedPage() {
  const { recentlyPlayed } =
    useRecentlyPlayedStore();

  const { playTrack } =
    usePlayer();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center shadow-lg">
          <History size={30} />
        </div>

        <div>
          <p className="text-sm text-zinc-400 uppercase tracking-[0.25em]">
            History
          </p>

          <h1 className="text-4xl font-black">
            Recently Played
          </h1>

          <p className="text-zinc-500 mt-1">
            {
              recentlyPlayed.length
            }{" "}
            songs
          </p>
        </div>
      </div>

      {/* Empty State */}
      {recentlyPlayed.length ===
        0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <History
            size={60}
            className="text-zinc-700 mb-6"
          />

          <h2 className="text-2xl font-bold mb-2">
            Nothing played yet
          </h2>

          <p className="text-zinc-500">
            Songs you play
            will appear
            here.
          </p>
        </div>
      )}

      {/* Songs */}
      <div className="flex flex-col gap-2">
        {recentlyPlayed.map(
          (track, index) => (
            <button
              key={track.id}
              onClick={() =>
                playTrack(
                  track,
                  recentlyPlayed
                )
              }
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition text-left"
            >
              {/* Index */}
              <span className="w-8 text-zinc-500 text-sm">
                {index + 1}
              </span>

              {/* Thumbnail */}
              <img
                src={
                  track.thumbnail
                }
                alt={track.title}
                className="w-14 h-14 rounded-xl object-cover"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {track.title}
                </p>

                <p className="text-sm text-zinc-400 truncate">
                  {track.artist}
                </p>
              </div>

              {/* Badge */}
              <div className="text-xs text-zinc-500">
                Recent
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}