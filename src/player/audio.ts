import { usePlayerStore } from "../store/playerStore";

class AudioEngine {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();

    this.audio.preload =
      "metadata";

    // ─────────────────────────────
    // Sync audio state with Zustand
    // ─────────────────────────────

    this.audio.onplay = () => {
      usePlayerStore
        .getState()
        .setPlaying(true);

      usePlayerStore
        .getState()
        .setLoading(false);
    };

    this.audio.onpause = () => {
      usePlayerStore
        .getState()
        .setPlaying(false);
    };

    this.audio.onended = () => {
      usePlayerStore
        .getState()
        .setPlaying(false);
    };

    this.audio.onloadstart =
      () => {
        usePlayerStore
          .getState()
          .setLoading(true);
      };

    this.audio.oncanplay =
      () => {
        usePlayerStore
          .getState()
          .setLoading(false);
      };

    this.audio.onloadedmetadata =
      () => {
        const store = usePlayerStore.getState();
        store.setDuration(this.audio.duration);
        store.setLoading(false);
      };

    this.audio.ontimeupdate =
      () => {
        usePlayerStore
          .getState()
          .setCurrentTime(
            this.audio
              .currentTime
          );
      };

    this.audio.onerror = () => {
      const store = usePlayerStore.getState();
      store.setLoading(false);
      store.setPlaying(false);
      store.setError(
        "Audio playback failed"
      );
    };

    this.audio.onabort = () => {
      usePlayerStore
        .getState()
        .setLoading(false);
    };

    this.audio.onwaiting = () => {
      usePlayerStore
        .getState()
        .setLoading(true);
    };

    this.audio.onplaying = () => {
      usePlayerStore
        .getState()
        .setLoading(false);
    };
  }

  get instance() {
    return this.audio;
  }

  async play(url: string) {
    if (!url) {
      throw new Error(
        "No stream URL provided"
      );
    }

    try {
      // Only change src if needed
      if (
        this.audio.src !== url
      ) {
        this.audio.src = url;

        this.audio.currentTime = 0;
      }

      const playPromise =
        this.audio.play();

      if (
        playPromise !==
        undefined
      ) {
        await playPromise;
      }
    } catch (error) {
      console.error(
        "Playback failed:",
        error
      );

      throw error;
    }
  }

  pause() {
    this.audio.pause();
  }

  resume() {
    this.audio.play();
  }

  seek(time: number) {
    this.audio.currentTime =
      time;
  }

  setVolume(volume: number) {
    this.audio.volume =
      volume;
  }

  setSource(src: string) {
    this.audio.src = src;
  }
}

export const audioEngine =
  new AudioEngine();