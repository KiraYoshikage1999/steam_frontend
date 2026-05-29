import React, { useState, useEffect } from 'react';
import CreateGameCard from './CreateGameCard';

//const API_BASE = 'https://26.185.217.20:7219';
const API_BASE = 'https://localhost:7219';

export function GamesFetch({ onGameClick, selectedGenres = [] }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        let url = `${API_BASE}/api/Game/get-all-games`;
        
        // Add genre filters to query if selected
        if (selectedGenres && selectedGenres.length > 0) {
          const genreParams = selectedGenres.map(id => `genreIds=${id}`).join('&');
          url += `?${genreParams}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const gamesArray = Array.isArray(data) ? data : data?.data ?? [];
        setGames(gamesArray);
      } catch (err) {
        setError(err.message ?? 'Can\'t fetch games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [selectedGenres]);

  if (loading) {
    return <div className="games-loading">Загрузка игр...</div>;
  }

  if (error) {
    return <div className="games-error">Ошибка: {error}</div>;
  }

  return (
    <div className="games-list">
      {games.length === 0 ? (
        <div className="games-empty">Игры не найдены</div>
      ) : (
        games.map((game) => (
          <CreateGameCard 
            key={game.id || game.name || Math.random()} 
            game={game}
            onClick={() => onGameClick && onGameClick(game)}
          />
        ))
      )}
    </div>
  );
}
