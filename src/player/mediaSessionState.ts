export function updatePlaybackState(
  isPlaying: boolean
) {
  if (!("mediaSession" in navigator)) {
    return;
  }

  navigator.mediaSession.playbackState =
    isPlaying ? "playing" : "paused";
}