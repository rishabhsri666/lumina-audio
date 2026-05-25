import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "../lib/firebase";

import type { Track } from "../types/track";

// ─────────────────────────────────────────────
// Like song
// ─────────────────────────────────────────────

export async function likeSong(
  uid: string,
  track: Track
) {
  const ref = doc(
    db,
    "users",
    uid,
    "likedSongs",
    track.id
  );

  await setDoc(ref, {
    ...track,

    createdAt: Date.now(),
  });
}

// ─────────────────────────────────────────────
// Unlike song
// ─────────────────────────────────────────────

export async function unlikeSong(
  uid: string,
  trackId: string
) {
  const ref = doc(
    db,
    "users",
    uid,
    "likedSongs",
    trackId
  );

  await deleteDoc(ref);
}

// ─────────────────────────────────────────────
// Fetch liked songs
// ─────────────────────────────────────────────

export async function getLikedSongs(
  uid: string
) {
  const ref = collection(
    db,
    "users",
    uid,
    "likedSongs"
  );

  const snapshot =
    await getDocs(ref);

  return snapshot.docs.map(
    (doc) => doc.data() as Track
  );
}