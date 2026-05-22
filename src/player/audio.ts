class AudioEngine {
  private audio: HTMLAudioElement;

constructor() {
  this.audio = new Audio();

  this.audio.preload = "metadata";
}

  get instance() {
    return this.audio;
  }

  async play(url: string) {
    if (!url) {
      throw new Error("No stream URL provided");
    }

    try {
      // Only set src if it's different
      if (this.audio.src !== url) {
        this.audio.src = url;
        this.audio.currentTime = 0;
      }

      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.error("Playback failed:", error);
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
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
  }
}

export const audioEngine = new AudioEngine();
