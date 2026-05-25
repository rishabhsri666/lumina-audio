import { useEffect } from "react";

import {
  Routes,
  Route,
  Link,
} from "react-router-dom";

import HomePage from "./pages/HomePage";

import SearchPage from "./pages/SearchPage";

import LikedSongsPage from "./pages/LikedSongsPage";

import MiniPlayer from "./components/player/MiniPlayer";

import ExpandedPlayer from "./components/player/ExpandedPlayer";

import { useUIStore } from "./store/uiStore";

import { useAuthStore } from "./store/authStore";

import { auth } from "./lib/firebase";

import { getLikedSongs } from "./services/likedSongsService";

import { useLikedSongsStore } from "./store/likedSongsStore";

import {
  observeAuthState,
  signInWithGoogle,
  logout,
} from "./services/auth";

export default function App() {
  const { isPlayerExpanded } =
    useUIStore();

  const { user } = useAuthStore();

  const setLikedSongs =
    useLikedSongsStore(
      (s) => s.setLikedSongs
    );

  useEffect(() => {
    const unsubscribe =
      auth.onAuthStateChanged(
        async (user) => {
          if (!user) {
            return;
          }

          try {
            const songs =
              await getLikedSongs(
                user.uid
              );

            setLikedSongs(songs);
          } catch (error) {
            console.error(
              "Failed to load liked songs:",
              error
            );
          }
        }
      );

    return () => unsubscribe();
  }, []);

  // ───────────────────────────────────────────────────────────
  // Firebase Auth Observer
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe =
      observeAuthState((user) => {
        useAuthStore
          .getState()
          .setUser(user);

        useAuthStore
          .getState()
          .setLoading(false);
      });

    return unsubscribe;
  }, []);

  return (
    <div
      className="
        h-screen
        w-screen
        overflow-hidden
        bg-background
        text-white
      "
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <header
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/5
            px-8
            py-5
          "
        >
          {/* Logo */}
          <Link
            to="/"
            className="
              text-2xl
              font-black
              tracking-tight
            "
          >
            Lumina
          </Link>

          {/* Nav */}
          <div className="flex items-center gap-8">
            <nav
              className="
                flex
                gap-6
                text-zinc-400
              "
            >
              <Link to="/">
                Home
              </Link>

              <Link to="/liked">
                Liked
              </Link>
              
              <Link to="/search">
                Search
              </Link>
            </nav>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <img
                  src={
                    user.photoURL ||
                    ""
                  }
                  alt={
                    user.displayName ||
                    "User"
                  }
                  className="
                    h-9
                    w-9
                    rounded-full
                    object-cover
                  "
                />

                {/* Logout */}
                <button
                  onClick={logout}
                  className="
                    rounded-xl
                    bg-white/10
                    px-4
                    py-2
                    text-sm
                    transition
                    hover:bg-white/15
                  "
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={
                  signInWithGoogle
                }
                className="
                  rounded-xl
                  bg-white
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-black
                  transition
                  hover:scale-[1.02]
                "
              >
                Login
              </button>
            )}
          </div>
        </header>

        {/* Pages */}
        <main
          className="
            flex-1
            overflow-y-auto
            pb-28
          "
        >
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />

            <Route
              path="/search"
              element={<SearchPage />}
            />

            <Route
              path="/liked"
              element={<LikedSongsPage />}
            />
          </Routes>
        </main>

        {/* Expanded Player */}
        {isPlayerExpanded && (
          <ExpandedPlayer />
        )}

        {/* Mini Player */}
        <MiniPlayer />
      </div>
    </div>
  );
}