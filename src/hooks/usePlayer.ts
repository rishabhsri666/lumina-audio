import { audioEngine } from "../player/audio";

import { usePlayerStore } from "../store/playerStore";

import { useQueueStore } from "../store/queueStore";

import { getStreamUrl } from "../api/player";

import type { Track } from "../types/track";

import { setupMediaSession } from "../player/mediaSession";

export function usePlayer() {
  const playerStore = usePlayerStore();

  const queueStore = useQueueStore();

  const playTrack = async (
    track: Track,
    queue?: Track[]
  ) => {
    try {
      playerStore.setLoading(true);

      playerStore.setError(null);

      const streamUrl =
        track.streamUrl ??
        (await getStreamUrl(track.id));

      const playableTrack = {
        ...track,
        streamUrl,
      };

      playerStore.setCurrentTrack(
        playableTrack
      );

      if (queue) {
        const index = queue.findIndex(
          (t) => t.id === track.id
        );

        queueStore.setQueue(queue, index);
      }

      await audioEngine.play(streamUrl);

      setupMediaSession(playableTrack, {
        onPlay: () => {
          audioEngine.resume();
        },

        onPause: () => {
          audioEngine.pause();
        },

        onNext: async () => {
          const next =
            queueStore.nextTrack();

          if (!next?.streamUrl) return;

          await audioEngine.play(
            next.streamUrl
          );
        },

        onPrevious: async () => {
          const prev =
            queueStore.previousTrack();

          if (!prev?.streamUrl) return;

          await audioEngine.play(
            prev.streamUrl
          );
        },
      });
    } catch (error) {
      console.error(error);

      playerStore.setError(
        "Playback failed"
      );
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