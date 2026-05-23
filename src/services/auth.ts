import {
  GoogleAuthProvider,

  signInWithPopup,

  signOut,

  onAuthStateChanged,

  
} from "firebase/auth";

import type { User } from "firebase/auth";

import { auth } from "../lib/firebase";

const provider =
  new GoogleAuthProvider();

export async function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

export async function logout() {
  return signOut(auth);
}

export function observeAuthState(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(
    auth,
    callback
  );
}