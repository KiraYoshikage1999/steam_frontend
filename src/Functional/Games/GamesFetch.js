import React, { useState, useEffect } from 'react';
import CreateGameCard from './CreateGameCard';

export function GamesFetch({ onGameClick }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://localhost:7219/api/Game/get-all-games');
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
  }, []);

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
