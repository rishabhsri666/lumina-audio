import { create } from "zustand";

import type { Track } from "../types/track";

interface QueueState {
  queue: Track[];

  currentIndex: number;

  setQueue: (
    tracks: Track[],
    startIndex?: number
  ) => void;

  addToQueue: (track: Track) => void;

  nextTrack: () => Track | null;

  previousTrack: () => Track | null;
}

export const useQueueStore = create<QueueState>(
  (set, get) => ({
    queue: [],

    currentIndex: 0,

    setQueue: (tracks, startIndex = 0) =>
      set({
        queue: tracks,
        currentIndex: startIndex,
      }),

    addToQueue: (track) =>
      set((state) => ({
        queue: [...state.queue, track],
      })),

    nextTrack: () => {
      const { queue, currentIndex } = get();

      const nextIndex = currentIndex + 1;

      if (nextIndex >= queue.length) {
        return null;
      }

      set({
        currentIndex: nextIndex,
      });

      return queue[nextIndex];
    },

    previousTrack: () => {
      const { queue, currentIndex } = get();

      const prevIndex = currentIndex - 1;

      if (prevIndex < 0) {
        return null;
      }

      set({
        currentIndex: prevIndex,
      });

      return queue[prevIndex];
    },
  })
);