import { Music } from "lucide-react";

import { useParams } from "react-router-dom";

import { usePlaylistStore } from "../store/playlistStore";

import { usePlayer } from "../hooks/usePlayer";

export default function PlaylistPage() {
  const { id } = useParams();

  const { playlists } =
    usePlaylistStore();

  const { playTrack } =
    usePlayer();

  const playlist =
    playlists.find(
      (p) => p.id === id
    );

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-500 text-xl">
          Playlist not found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="min-h-screen bg-black text-white rounded-3xl p-6 lg:p-10">
        {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end mb-10">
        <div className="w-52 h-52 rounded-3xl bg-zinc-800 flex items-center justify-center shadow-2xl text-7xl">
          🎵
        </div>

        <div>
          <p className="uppercase tracking-[0.25em] text-sm text-zinc-400">
            Playlist
          </p>

          <h1 className="text-5xl md:text-7xl font-black mt-2">
            {playlist.name}
          </h1>

          <p className="mt-4 text-zinc-400 text-lg">
            {
              playlist.songs
                .length
            }{" "}
            songs
          </p>
        </div>
      </div>

      {/* Empty */}
      {playlist.songs.length ===
        0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Music
            size={64}
            className="text-zinc-700 mb-6"
          />

          <h2 className="text-2xl font-bold mb-2">
            Playlist is empty
          </h2>

          <p className="text-zinc-500">
            Add songs to start
            listening.
          </p>
        </div>
      )}

      {/* Songs */}
      <div className="flex flex-col gap-3">
        {playlist.songs.map(
          (track, index) => (
            <button
              key={track.id}
              onClick={() =>
                playTrack(
                  track,
                  playlist.songs
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
            </button>
          )
        )}
      </div>
    </div>
  </div>
  );
}