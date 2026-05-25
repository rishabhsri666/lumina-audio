import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../lib/firebase";

import type { Track } from "../types/track";

// ─────────────────────────────────────────────
// Save recently played
// ─────────────────────────────────────────────

export async function saveRecentlyPlayed(
  uid: string,
  track: Track
) {
  const ref = doc(
    db,
    "users",
    uid,
    "recentlyPlayed",
    track.id
  );

  await setDoc(ref, {
    ...track,

    playedAt: Date.now(),
  });
}

// ─────────────────────────────────────────────
// Fetch recently played
// ─────────────────────────────────────────────

export async function getRecentlyPlayed(
  uid: string
): Promise<Track[]> {
  const ref = collection(
    db,
    "users",
    uid,
    "recentlyPlayed"
  );

  const q = query(
    ref,
    orderBy(
      "playedAt",
      "desc"
    ),
    limit(50)
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      doc.data() as Track
  );
}