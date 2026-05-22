import { create } from "zustand";

interface UIState {
  isPlayerExpanded: boolean;

  expandPlayer: () => void;

  collapsePlayer: () => void;
}

export const useUIStore = create<UIState>(
  (set) => ({
    isPlayerExpanded: false,

    expandPlayer: () =>
      set({
        isPlayerExpanded: true,
      }),

    collapsePlayer: () =>
      set({
        isPlayerExpanded: false,
      }),
  })
);