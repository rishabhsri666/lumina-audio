import { create } from "zustand";

import { persist } from "zustand/middleware";

import type { Track } from "../types/track";

interface RecentlyPlayedState {
  recentlyPlayed: Track[];

  setRecentlyPlayed: (
    tracks: Track[]
  ) => void;

  addRecentlyPlayed: (
    track: Track
  ) => void;
}

export const useRecentlyPlayedStore =
  create<RecentlyPlayedState>()(
    persist(
      (set) => ({
        recentlyPlayed: [],

        setRecentlyPlayed: (
          tracks
        ) =>
          set({
            recentlyPlayed:
              tracks,
          }),

        addRecentlyPlayed: (
          track
        ) =>
          set((state) => {
            // remove duplicate if exists
            const filtered =
              state.recentlyPlayed.filter(
                (t) =>
                  t.id !== track.id
              );

            return {
              recentlyPlayed: [
                track,
                ...filtered,
              ].slice(0, 50),
            };
          }),
      }),
      {
        name: "lumina-recently-played-storage",

        partialize: (state) => ({
          recentlyPlayed:
            state.recentlyPlayed,
        }),
      }
    )
  );