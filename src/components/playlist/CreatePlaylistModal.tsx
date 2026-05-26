import { v4 as uuid } from "uuid";

import { useState } from "react";

import { X } from "lucide-react";

import { auth } from "../../lib/firebase";

import {
  createPlaylist,
} from "../../services/playlistService";

import {
  usePlaylistStore,
} from "../../store/playlistStore";

interface Props {
  open: boolean;

  onClose: () => void;
}

export default function CreatePlaylistModal({
  open,
  onClose,
}: Props) {
  const [name, setName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const addPlaylist =
    usePlaylistStore(
      (s) => s.addPlaylist
    );

  if (!open) return null;

  const handleCreate =
    async () => {
      const user =
        auth.currentUser;

      if (!user || !name.trim()) {
        return;
      }

      try {
        setLoading(true);

        const playlist = {
          id: uuid(),

          name:
            name.trim(),

          songs: [],
        };

        // optimistic update
        addPlaylist(
          playlist
        );

        // firestore sync
        await createPlaylist(
          user.uid,
          playlist
        );

        setName("");

        onClose();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/10 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white">
            Create Playlist
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="My Playlist"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30 transition"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={
              handleCreate
            }
            disabled={
              loading
            }
            className="px-5 py-2 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}