import { api } from "./client";

export async function searchSongs(
  query: string
) {
  const response = await api.get(
    `/search?q=${encodeURIComponent(query)}`
  );

  return response.data;
}