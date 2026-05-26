import { create } from "zustand";

import type { Track } from "../types/track";

export interface Playlist {
  id: string;

  name: string;

  songs: Track[];
}

interface PlaylistState {
  playlists: Playlist[];

  setPlaylists: (
    playlists: Playlist[]
  ) => void;

  addPlaylist: (
    playlist: Playlist
  ) => void;

  addSongToPlaylist: (
    playlistId: string,
    track: Track
  ) => void;
}

export const usePlaylistStore =
  create<PlaylistState>(
    (set) => ({
      playlists: [],

      setPlaylists: (
        playlists
      ) =>
        set({
          playlists,
        }),

      addPlaylist: (
        playlist
      ) =>
        set((state) => ({
          playlists: [
            playlist,
            ...state.playlists,
          ],
        })),

      addSongToPlaylist: (
        playlistId,
        track
      ) =>
        set((state) => ({
          playlists:
            state.playlists.map(
              (playlist) => {
                if (
                  playlist.id !==
                  playlistId
                ) {
                  return playlist;
                }

                const exists =
                  playlist.songs.some(
                    (song) =>
                      song.id ===
                      track.id
                  );

                if (exists) {
                  return playlist;
                }

                return {
                  ...playlist,

                  songs: [
                    track,
                    ...playlist.songs,
                  ],
                };
              }
            ),
        })),
    })
  );