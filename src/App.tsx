import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";

import MiniPlayer from "./components/player/MiniPlayer";
import ExpandedPlayer from "./components/player/ExpandedPlayer";

import { useUIStore } from "./store/uiStore";

export default function App() {
  const { isPlayerExpanded } = useUIStore();
  
  return (
    <div className="h-screen w-screen bg-background text-white overflow-hidden">
      <div className="flex h-full flex-col">
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