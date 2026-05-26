import { Heart } from "lucide-react";

import { useLikedSongsStore } from "../store/likedSongsStore";

import { usePlayer } from "../hooks/usePlayer";

export default function LikedSongsPage() {
  const { likedSongs } =
    useLikedSongsStore();

  const { playTrack } =
    usePlayer();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="min-h-screen bg-black text-white rounded-3xl p-6 lg:p-10">
        {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-pink-500 flex items-center justify-center shadow-lg">
          <Heart
            size={30}
            fill="white"
          />
        </div>

        <div>
          <p className="text-sm text-zinc-400 uppercase tracking-[0.25em]">
            Playlist
          </p>

          <h1 className="text-4xl font-black">
            Liked Songs
          </h1>

          <p className="text-zinc-500 mt-1">
            {likedSongs.length} songs
          </p>
        </div>
      </div>

      {/* Empty State */}
      {likedSongs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Heart
            size={60}
            className="text-zinc-700 mb-6"
          />

          <h2 className="text-2xl font-bold mb-2">
            No liked songs yet
          </h2>

          <p className="text-zinc-500">
            Songs you like will appear here.
          </p>
        </div>
      )}

      {/* Songs */}
      <div className="flex flex-col gap-3">
        {likedSongs.map(
          (track, index) => (
            <button
              key={track.id}
              onClick={() =>
                playTrack(
                  track,
                  likedSongs
                )
              }
              className="flex items-center gap-4 rounded-3xl bg-white/5 p-4 transition hover:bg-white/10 text-left"
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

              {/* Heart */}
              <Heart
                size={18}
                fill="currentColor"
                className="text-pink-500 shrink-0"
              />
            </button>
          )
        )}
      </div>
    </div>
  </div>
  );
}