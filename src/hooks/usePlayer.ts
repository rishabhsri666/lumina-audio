import { audioEngine } from "../player/audio";

import { usePlayerStore } from "../store/playerStore";

import { useQueueStore } from "../store/queueStore";

import type { Track } from "../types/track";

export function usePlayer() {
  const playerStore = usePlayerStore();

  const queueStore = useQueueStore();

  const playTrack = async (
    track: Track,
    queue?: Track[]
  ) => {
    if (!track.streamUrl) {
      playerStore.setError("No stream URL available");
      return;
    }

    try {
      playerStore.setLoading(true);

      playerStore.setError(null);

      await audioEngine.play(track.streamUrl);

      playerStore.setCurrentTrack(track);

      if (queue) {
        const index = queue.findIndex(
          (t) => t.id === track.id
        );

        queueStore.setQueue(queue, index);
      }
    } catch (error) {
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : "Failed to play track";
      
      playerStore.setError(errorMessage);

      playerStore.setPlaying(false);

      console.error("Error playing track:", error);
    } finally {
      playerStore.setLoading(false);
    }
  };

  const pause = () => {
    audioEngine.pause();
  };

  const resume = () => {
    audioEngine.resume();
  };

  const seek = (time: number) => {
    audioEngine.seek(time);
  };

  const setVolume = (volume: number) => {
    audioEngine.setVolume(volume);

    playerStore.setVolume(volume);
  };

  return {
    ...playerStore,

    playTrack,

    pause,

    resume,

    seek,

    setVolume,
  };
}