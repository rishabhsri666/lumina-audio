import { useState } from "react";

import { Link } from "react-router-dom";

import { Plus } from "lucide-react";

import { usePlaylistStore } from "../store/playlistStore";

import TrackCard from "../components/player/TrackCard";

import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal";

import { mockTracks } from "../utils/mockTracks";

import { usePlayer } from "../hooks/usePlayer";

export default function HomePage() {
  const { playTrack } =
    usePlayer();

  const [
    playlistModalOpen,
    setPlaylistModalOpen,
  ] = useState(false);

  const { playlists } =
    usePlaylistStore();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
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
            Immerse yourself in
            sound.
          </p>
        </div>

        {/* Create Playlist */}
        <button
          onClick={() =>
            setPlaylistModalOpen(
              true
            )
          }
          className="
            flex
            items-center
            gap-2
            self-start
            rounded-2xl
            bg-white
            px-5
            py-3
            font-semibold
            text-black
            transition
            hover:opacity-90
          "
        >
          <Plus size={18} />

          New Playlist
        </button>
      </div>

      {/* Playlists */}
      {playlists.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-5 text-3xl font-black">
            Your Playlists
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {playlists.map(
              (playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="rounded-3xl bg-white/5 p-5 border border-white/5 hover:bg-white/10 transition"
                >
                  <div className="aspect-square rounded-2xl bg-zinc-800 mb-4 flex items-center justify-center text-4xl font-black">
                    🎵
                  </div>

                  <h3 className="text-lg font-bold truncate">
                    {playlist.name}
                  </h3>

                  <p className="text-sm text-zinc-400 mt-1">
                    {
                      playlist.songs
                        .length
                    }{" "}
                    songs
                  </p>
                </Link>
              )
            )}
          </div>
        </div>
      )}

      {/* Tracks */}
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
        {mockTracks.map(
          (track) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlay={() =>
                playTrack(
                  track,
                  mockTracks
                )
              }
            />
          )
        )}
      </div>

      {/* Playlist Modal */}
      <CreatePlaylistModal
        open={
          playlistModalOpen
        }
        onClose={() =>
          setPlaylistModalOpen(
            false
          )
        }
      />
    </div>
  );
}