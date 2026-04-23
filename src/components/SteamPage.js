import { useState } from 'react';
import SteamTopbar from './SteamTopbar';
import SteamHero from './SteamHero';
import GameDetail from './GameDetail';
import AuthPages from './AuthPages';

export default function SteamPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setCurrentPage('game-detail');
  };

  const handleBackFromGame = () => {
    setCurrentPage('home');
    setSelectedGame(null);
  };

  const handleAuthClick = () => {
    setCurrentPage('auth');
  };

  const handleBackFromAuth = () => {
    setCurrentPage('home');
  };

  return (
    <div className="App">
      <SteamTopbar onAuthClick={handleAuthClick} />
      
      {currentPage === 'home' && (
        <div className="steam-shell">
          <main className="steam-main">
            <SteamHero onGameClick={handleGameClick} />
          </main>
        </div>
      )}

      {currentPage === 'game-detail' && (
        <div className="steam-shell">
          <GameDetail gameId={selectedGame?.id} game={selectedGame} onBack={handleBackFromGame} />
        </div>
      )}

      {currentPage === 'auth' && (
        <div className="steam-shell">
          <div style={{ marginTop: '80px' }}>
            <AuthPages onBack={handleBackFromAuth} />
          </div>
        </div>
      )}
    </div>
  );
}
