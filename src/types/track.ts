export interface Track {
  id: string;
  title: string;
  artist: string;

  thumbnail: string;

  duration?: number;

  streamUrl?: string;
}