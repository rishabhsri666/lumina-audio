import { create } from "zustand";

import type { Track } from "../types/track";

interface LikedSongsState {
  likedSongs: Track[];

  setLikedSongs: (
    songs: Track[]
  ) => void;

  addLikedSong: (
    song: Track
  ) => void;

  removeLikedSong: (
    id: string
  ) => void;

  isLiked: (
    id: string
  ) => boolean;
}

export const useLikedSongsStore =
  create<LikedSongsState>(
    (set, get) => ({
      likedSongs: [],

      setLikedSongs: (
        songs
      ) =>
        set({
          likedSongs: songs,
        }),

      addLikedSong: (
        song
      ) =>
        set((state) => ({
          likedSongs: [
            song,
            ...state.likedSongs,
          ],
        })),

      removeLikedSong: (
        id
      ) =>
        set((state) => ({
          likedSongs:
            state.likedSongs.filter(
              (song) =>
                song.id !== id
            ),
        })),

      isLiked: (id) =>
        get().likedSongs.some(
          (song) =>
            song.id === id
        ),
    })
  );