import { spawn } from "child_process";

import path from "path";

import { streamCache } from "./cacheService";

export async function extractAudioStream(
  videoId: string
): Promise<string> {
  const cached =
    streamCache.get<string>(videoId);

  if (cached) {
    console.log("Using cached stream");

    return cached;
  }

  return new Promise((resolve, reject) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const ytDlpPath = path.resolve(
      __dirname,
      "../../bin/yt-dlp.exe"
    );

    const process = spawn(ytDlpPath, [
      "-f",
      "bestaudio",

      "-g",

      videoUrl,
    ]);

    let output = "";

    let error = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(error);
      }

      const streamUrl = output.trim();

      if (!streamUrl) {
        return reject(
          "No stream URL returned"
        );
      }

      streamCache.set(videoId, streamUrl);

      resolve(streamUrl);
    });
  });
}