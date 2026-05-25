import { create } from "zustand";

import { persist } from "zustand/middleware";

import type { Track } from "../types/track";

interface PlayerState {
  currentTrack: Track | null;

  isPlaying: boolean;

  currentTime: number;

  duration: number;

  volume: number;

  isLoading: boolean;

  repeat: boolean;

  shuffle: boolean;

  error: string | null;

  setCurrentTrack: (
    track: Track | null
  ) => void;

  setPlaying: (
    playing: boolean
  ) => void;

  setCurrentTime: (
    time: number
  ) => void;

  setDuration: (
    duration: number
  ) => void;

  setVolume: (
    volume: number
  ) => void;

  toggleRepeat: () => void;

  toggleShuffle: () => void;

  setLoading: (
    loading: boolean
  ) => void;

  setError: (
    error: string | null
  ) => void;
}

export const usePlayerStore =
  create<PlayerState>()(
    persist(
      (set) => ({
        currentTrack: null,

        isPlaying: false,

        currentTime: 0,

        duration: 0,

        volume: 1,

        isLoading: false,

        repeat: false,

        shuffle: false,

        error: null,

        setCurrentTrack: (
          track
        ) =>
          set({
            currentTrack: track,
          }),

        setPlaying: (
          playing
        ) =>
          set({
            isPlaying: playing,
          }),

        setCurrentTime: (
          time
        ) =>
          set({
            currentTime: time,
          }),

        setDuration: (
          duration
        ) =>
          set({
            duration,
          }),

        setVolume: (
          volume
        ) =>
          set({
            volume,
          }),

        toggleRepeat: () =>
          set((state) => ({
            repeat:
              !state.repeat,
          })),

        toggleShuffle: () =>
          set((state) => ({
            shuffle:
              !state.shuffle,
          })),

        setLoading: (
          loading
        ) =>
          set({
            isLoading: loading,
          }),

        setError: (
          error
        ) =>
          set({
            error,
          }),
      }),
      {
        name: "lumina-player-storage",

        partialize: (state) => ({
          currentTrack:
            state.currentTrack,

          currentTime:
            state.currentTime,

          volume:
            state.volume,

          repeat:
            state.repeat,

          shuffle:
            state.shuffle,
        }),
      }
    )
  );