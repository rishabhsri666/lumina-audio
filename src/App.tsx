import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";

import MiniPlayer from "./components/player/MiniPlayer";
import ExpandedPlayer from "./components/player/ExpandedPlayer";

import { useUIStore } from "./store/uiStore";

import { Link } from "react-router-dom";

export default function App() {
  const { isPlayerExpanded } = useUIStore();

  return (
    <div className="h-screen w-screen bg-background text-white overflow-hidden">
      <div className="flex h-full flex-col">
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
          <Link
            to="/"
            className="text-2xl font-black"
          >
            Lumina
          </Link>

          <nav className="flex gap-6 text-zinc-400">
            <Link to="/">Home</Link>

            <Link to="/search">
              Search
            </Link>
          </nav>
        </header>
        <main className="flex-1 overflow-y-auto pb-28">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        {isPlayerExpanded && <ExpandedPlayer />}

        <MiniPlayer />
      </div>
    </div>
  );
}