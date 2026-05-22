import { audioEngine } from "./audio";

import { usePlayerStore } from "../store/playerStore";

import { useQueueStore } from "../store/queueStore";

import { updatePlaybackState } from "./mediaSessionState";

const audio = audioEngine.instance;

// Initialize volume from store
const initialVolume = usePlayerStore.getState().volume;
audio.volume = initialVolume;

audio.addEventListener("timeupdate", () => {
  usePlayerStore
    .getState()
    .setCurrentTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  usePlayerStore
    .getState()
    .setDuration(audio.duration);
});

audio.addEventListener("loadstart", () => {
  usePlayerStore
    .getState()
    .setLoading(true);
});

audio.addEventListener("play", () => {
  usePlayerStore
    .getState()
    .setPlaying(true);
    
  usePlayerStore
    .getState()
    .setError(null);

  updatePlaybackState(true);
});

audio.addEventListener("pause", () => {
  usePlayerStore
    .getState()
    .setPlaying(false);

  updatePlaybackState(false);
});

audio.addEventListener("ended", async () => {
  const { nextTrack } = useQueueStore.getState();
  const next = nextTrack();

  if (!next?.streamUrl) return;

  try {
    await audioEngine.play(next.streamUrl);
    usePlayerStore
      .getState()
      .setCurrentTrack(next);
  } catch (error) {
    console.error("Failed to play next track:", error);
    usePlayerStore
      .getState()
      .setError("Failed to play next track");
  }
});

audio.addEventListener("waiting", () => {
  usePlayerStore
    .getState()
    .setLoading(true);
});

audio.addEventListener("canplay", () => {
  usePlayerStore
    .getState()
    .setLoading(false);
});

audio.addEventListener("canplaythrough", () => {
  usePlayerStore
    .getState()
    .setLoading(false);
});

audio.addEventListener("playing", () => {
  usePlayerStore
    .getState()
    .setLoading(false);
});

audio.addEventListener("error", () => {
  const error = audio.error;
  let errorMessage = "Failed to load audio";
  
  if (error) {
    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        errorMessage = "Audio loading was aborted";
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        errorMessage = "Network error - check your connection or the URL";
        break;
      case MediaError.MEDIA_ERR_DECODE:
        errorMessage = "Audio format not supported by this browser";
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage = "Audio source not supported - check URL or CORS settings";
        break;
      default:
        errorMessage = "Unknown audio error occurred";
    }
  }
  
  usePlayerStore
    .getState()
    .setError(errorMessage);
  
  usePlayerStore
    .getState()
    .setLoading(false);

  usePlayerStore
    .getState()
    .setPlaying(false);

  console.error("Audio error:", error);
});

audio.addEventListener("abort", () => {
  usePlayerStore
    .getState()
    .setError("Audio loading was aborted");

  usePlayerStore
    .getState()
    .setLoading(false);
});

audio.addEventListener("stalled", () => {
  console.warn("Audio loading stalled - network may be slow");
});

audio.addEventListener("suspend", () => {
  console.warn("Audio loading suspended");
});
