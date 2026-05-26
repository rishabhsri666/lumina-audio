import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

import type {
  Playlist,
} from "../store/playlistStore";

import type { Track } from "../types/track";

// ─────────────────────────────────────────────
// Create playlist
// ─────────────────────────────────────────────

export async function createPlaylist(
  uid: string,
  playlist: Playlist
) {
  const ref = doc(
    db,
    "users",
    uid,
    "playlists",
    playlist.id
  );

  await setDoc(ref, playlist);
}

// ─────────────────────────────────────────────
// Fetch playlists
// ─────────────────────────────────────────────

export async function getPlaylists(
  uid: string
): Promise<Playlist[]> {
  const ref = collection(
    db,
    "users",
    uid,
    "playlists"
  );

  const snapshot =
    await getDocs(ref);

  return snapshot.docs.map(
    (doc) =>
      doc.data() as Playlist
  );
}

// ─────────────────────────────────────────────
// Add song to playlist
// ─────────────────────────────────────────────

export async function addSongToPlaylist(
  uid: string,
  playlist: Playlist,
  track: Track
) {
  const exists =
    playlist.songs.some(
      (song) =>
        song.id === track.id
    );

  if (exists) {
    return;
  }

  const updatedSongs = [
    track,
    ...playlist.songs,
  ];

  const ref = doc(
    db,
    "users",
    uid,
    "playlists",
    playlist.id
  );

  await updateDoc(ref, {
    songs: updatedSongs,
  });
}