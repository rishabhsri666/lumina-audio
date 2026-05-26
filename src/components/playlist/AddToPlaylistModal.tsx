import { X } from "lucide-react";

import { auth } from "../../lib/firebase";

import {
  addSongToPlaylist as addSongToPlaylistService,
} from "../../services/playlistService";

import {
  usePlaylistStore,
} from "../../store/playlistStore";

import type { Track } from "../../types/track";

interface Props {
  open: boolean;

  onClose: () => void;

  track: Track;
}

export default function AddToPlaylistModal({
  open,
  onClose,
  track,
}: Props) {
  const {
    playlists,

    addSongToPlaylist,
  } = usePlaylistStore();

  if (!open) return null;

  const handleAdd =
    async (
      playlistId: string
    ) => {
      const user =
        auth.currentUser;

      if (!user) return;

      const playlist =
        playlists.find(
          (p) =>
            p.id ===
            playlistId
        );

      if (!playlist) {
        return;
      }

      try {
        // optimistic update
        addSongToPlaylist(
          playlistId,
          track
        );

        // firestore sync
        await addSongToPlaylistService(
          user.uid,
          playlist,
          track
        );

        onClose();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/10 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white">
            Add to Playlist
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Empty */}
        {playlists.length ===
          0 && (
          <p className="text-zinc-500 text-center py-8">
            No playlists yet.
          </p>
        )}

        {/* Playlist List */}
        <div className="flex flex-col gap-3">
          {playlists.map(
            (playlist) => (
              <button
                key={
                  playlist.id
                }
                onClick={() =>
                  handleAdd(
                    playlist.id
                  )
                }
                className="flex items-center gap-4 rounded-2xl bg-white/5 hover:bg-white/10 transition p-4 text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl">
                  🎵
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">
                    {
                      playlist.name
                    }
                  </p>

                  <p className="text-sm text-zinc-400">
                    {
                      playlist.songs
                        .length
                    }{" "}
                    songs
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