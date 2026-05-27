import { api } from "./client";

export async function getStreamUrl(videoId: string): Promise<string> {
  const isProduction = import.meta.env.MODE === "production";

  if (isProduction) {
    // Production: backend pipes stream directly, use URL as audio src
    console.log("🚀 Production mode: using proxy stream URL");
    return `${import.meta.env.VITE_API_URL}/stream/${videoId}`;
  }

  // Localhost: backend returns raw YouTube URL as JSON
  console.log("🏠 Local mode: fetching raw stream URL");
  const response = await api.get(`/stream/${videoId}`);
  return response.data.streamUrl;
}