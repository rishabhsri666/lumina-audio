import { useEffect } from "react";

import { audioEngine } from "../player/audio";

import { usePlayerStore } from "../store/playerStore";

import { useQueueStore } from "../store/queueStore";

import { getStreamUrl } from "../api/player";

import type { Track } from "../types/track";

import { setupMediaSession } from "../player/mediaSession";

import { auth } from "../lib/firebase";

import { saveRecentlyPlayed } from "../services/recentlyPlayedService";

import { useRecentlyPlayedStore } from "../store/recentlyPlayedStore";

// ─────────────────────────────────────────────
// Module-level flag to ensure restore happens only once globally
// ─────────────────────────────────────────────
let hasRestored = false;

export function usePlayer() {
  const playerStore =
    usePlayerStore();

  const queueStore =
    useQueueStore();

  const addRecentlyPlayed =
    useRecentlyPlayedStore(
      (s) =>
        s.addRecentlyPlayed
    );

  // ─────────────────────────────────────────────
  // Restore persisted track on refresh (only once globally)
  // ─────────────────────────────────────────────

  useEffect(() => {
    // Skip if already restored in another component instance
    if (hasRestored) return;

    const restoreTrack =
      async () => {
        hasRestored = true; // Mark as restored immediately to prevent duplicate restores

        const track =
          playerStore.currentTrack;

        try {
          // Set volume from persisted state
          audioEngine.setVolume(
            playerStore.volume
          );

          if (!track) {
            // No track to restore
            playerStore.setLoading(
              false
            );
            playerStore.setPlaying(
              false
            );
            return;
          }

          let playableTrack = track;
          let streamUrl = track.streamUrl;

          try {
            streamUrl = await getStreamUrl(
              track.id
            );
          } catch (error) {
            if (!streamUrl) {
              throw error;
            }
          }

          playableTrack = {
            ...track,
            streamUrl,
          };

          playerStore.setCurrentTrack(
            playableTrack
          );

          if (!streamUrl) {
            playerStore.setLoading(
              false
            );
            playerStore.setPlaying(
              false
            );
            return;
          }

          // Restore audio source without auto-playing immediately
          audioEngine.setSource(
            streamUrl
          );

          const audio = audioEngine.instance;
          const shouldResume =
            playerStore.isPlaying;
          const restoreTime =
            playerStore.currentTime;

          const restorePosition = async () => {
            if (restoreTime > 0) {
              audio.currentTime =
                Math.min(
                  restoreTime,
                  audio.duration ||
                    restoreTime
                );

              playerStore.setCurrentTime(
                audio.currentTime
              );
            }

            if (shouldResume) {
              try {
                await audioEngine.resume();
              } catch (error) {
                console.warn(
                  "Playback resume blocked:",
                  error
                );
                playerStore.setPlaying(
                  false
                );
              }
            }
          };

          audio.addEventListener(
            "loadedmetadata",
            restorePosition,
            {
              once: true,
            }
          );

          // Set track info before loading so UI can render immediately.
          playerStore.setCurrentTrack(
            playableTrack
          );
          playerStore.setPlaying(false);

          // Load metadata by loading the audio
          audio.load();

          if (
            audio.readyState >=
            HTMLMediaElement.HAVE_METADATA
          ) {
            restorePosition();
          }

          playerStore.setLoading(
            false
          );
        } catch (error) {
          console.error(
            "Failed to restore track:",
            error
          );
          playerStore.setLoading(
            false
          );
          playerStore.setPlaying(
            false
          );
        }
      };

    restoreTrack();
  }, []);

  // ─────────────────────────────────────────────
  // Main playback
  // ─────────────────────────────────────────────

  const playTrack = async (
    track: Track,
    queue?: Track[]
  ) => {
    try {
      playerStore.setLoading(
        true
      );

      playerStore.setError(
        null
      );

      const streamUrl =
        await getStreamUrl(
          track.id
        );

      const playableTrack = {
        ...track,

        streamUrl,
      };

      playerStore.setCurrentTrack(
        playableTrack
      );

      const user =
        auth.currentUser;

      if (user) {
        addRecentlyPlayed(
          playableTrack
        );

        await saveRecentlyPlayed(
          user.uid,
          playableTrack
        );
      }

      if (queue) {
        const index =
          queue.findIndex(
            (t) =>
              t.id === track.id
          );

        queueStore.setQueue(
          queue,
          index
        );
      }

      await audioEngine.play(
        streamUrl
      );

      setupMediaSession(
        playableTrack,
        {
          onPlay: () => {
            audioEngine.resume();
          },

          onPause: () => {
            audioEngine.pause();
          },

          onNext: async () => {
            const next =
              queueStore.nextTrack();

            if (!next) return;

            await playTrack(
              next
            );
          },

          onPrevious:
            async () => {
              const prev =
                queueStore.previousTrack();

              if (!prev)
                return;

              await playTrack(
                prev
              );
            },
        }
      );
    } catch (error) {
      console.error(error);

      playerStore.setError(
        "Playback failed"
      );
    } finally {
      playerStore.setLoading(
        false
      );
    }
  };

  // ─────────────────────────────────────────────
  // Controls
  // ─────────────────────────────────────────────

  const pause = () => {
    audioEngine.pause();
  };

  const resume = () => {
    audioEngine.resume();
  };

  const seek = (
    time: number
  ) => {
    audioEngine.seek(time);
  };

  const setVolume = (
    volume: number
  ) => {
    audioEngine.setVolume(
      volume
    );

    playerStore.setVolume(
      volume
    );
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