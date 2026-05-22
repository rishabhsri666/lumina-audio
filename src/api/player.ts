import { api } from "./client";

export async function getStreamUrl(
  videoId: string
) {
  const response = await api.get(
    `/stream/${videoId}`
  );

  return response.data.streamUrl;
}