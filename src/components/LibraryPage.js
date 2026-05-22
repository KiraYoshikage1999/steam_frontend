import React from 'react';
import CreateGameCard from '../Functional/Games/CreateGameCard';

export default function LibraryPage({ user, onBack, onGameClick }) {
  const purchasedGames = user?.PurchasedGames || user?.purchasedGames || [];

  return (
    <div className="steam-shell">
      <div style={{ marginTop: '80px' }}>
        <button onClick={onBack} className="btn-back">← Назад</button>
        <div className="auth-container">
          <h2 className="auth-title">Библиотека</h2>
          {!user ? (
            <div className="games-empty">Войдите, чтобы увидеть библиотеку</div>
          ) : Array.isArray(purchasedGames) && purchasedGames.length ? (
            <div className="games-list">
              {purchasedGames.map((g) => (
                <CreateGameCard
                  key={g.id || g.Id || g.name || g.Name}
                  game={{
                    ...g,
                    id: g.id || g.Id,
                    name: g.name || g.Name,
                  }}
                  onClick={() => onGameClick && onGameClick(g)}
                />
              ))}
            </div>
          ) : (
            <div className="games-empty">Пока нет купленных игр</div>
          )}
        </div>
      </div>
    </div>
  );
}

