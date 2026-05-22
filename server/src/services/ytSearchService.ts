import { Innertube } from "youtubei.js";

let youtube: Innertube;

async function getYoutube() {
  if (!youtube) {
    youtube = await Innertube.create();
  }

  return youtube;
}

export interface SearchTrack {
  id: string;

  title: string;

  artist: string;

  thumbnail: string;

  duration: string;
}

export async function searchSongs(
  query: string
): Promise<SearchTrack[]> {
  const yt = await getYoutube();

  const results = await yt.search(query, {
    type: "video",
  });

  const tracks: SearchTrack[] = [];

  for (const video of results.videos) {
    try {
      if (
        !("id" in video) ||
        !("title" in video)
      ) {
        continue;
      }

      tracks.push({
        id: String(video.id),

        title:
          typeof video.title === "string"
            ? video.title
            : video.title?.text || "Unknown Title",

        artist:
          "author" in video
            ? video.author?.name ||
              "Unknown Artist"
            : "Unknown Artist",

        thumbnail:
          "thumbnails" in video
            ? video.thumbnails?.[0]?.url || ""
            : "",

        duration:
          "duration" in video
            ? video.duration?.text || "0:00"
            : "0:00",
      });
    } catch {
      continue;
    }
  }

  return tracks.slice(0, 20);
}