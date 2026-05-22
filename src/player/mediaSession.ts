import type { Track } from "../types/track";

interface MediaSessionHandlers {
  onPlay: () => void;

  onPause: () => void;

  onNext: () => void;

  onPrevious: () => void;
}

export function setupMediaSession(
  track: Track,
  handlers: MediaSessionHandlers
) {
  if (!("mediaSession" in navigator)) {
    return;
  }

  navigator.mediaSession.metadata =
    new MediaMetadata({
      title: track.title,

      artist: track.artist,

      album: "Lumina Audio",

      artwork: [
        {
          src: track.thumbnail,

          sizes: "512x512",

          type: "image/jpeg",
        },
      ],
    });

  navigator.mediaSession.setActionHandler(
    "play",
    handlers.onPlay
  );

  navigator.mediaSession.setActionHandler(
    "pause",
    handlers.onPause
  );

  navigator.mediaSession.setActionHandler(
    "nexttrack",
    handlers.onNext
  );

  navigator.mediaSession.setActionHandler(
    "previoustrack",
    handlers.onPrevious
  );
}