import React, { useEffect, useMemo, useState } from 'react';
import CreateGameCard from '../Functional/Games/CreateGameCard';
import { removeFromWishList } from '../Functional/WishList/WishListService';

const API_BASE = 'https://localhost:7219';

export default function WishListPage({ user, onBack, onGameClick }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await fetch(`${API_BASE}/api/WishList/get-all`);
        const json = await resp.json().catch(() => null);
        if (!resp.ok) {
          const msg = (json && (json.message || json.title || json.error)) || `HTTP ${resp.status}`;
          throw new Error(msg);
        }
        const data = Array.isArray(json) ? json : json?.data || json?.Data || [];
        if (!cancelled) setLists(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Не удалось загрузить список желаемого');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const userId = user?.Id || user?.id || null;
  const myList = useMemo(() => {
    if (!userId) return null;
    return lists.find((l) => (l.userId || l.UserId) === userId) || null;
  }, [lists, userId]);

  const wishGames = myList?.wishGames || myList?.WishGames || [];

  const handleRemoveGame = async (gameId) => {
    if (!userId) return;
    setRemoving(true);
    try {
      await removeFromWishList(userId, gameId);
      setLists((prev) =>
        prev.map((l) => {
          if ((l.userId || l.UserId) === userId) {
            const updatedWishes = Array.isArray(l.wishGames)
              ? l.wishGames.filter((g) => (g.id || g.Id) !== gameId)
              : Array.isArray(l.WishGames)
              ? l.WishGames.filter((g) => (g.id || g.Id) !== gameId)
              : [];
            return { ...l, wishGames: updatedWishes, WishGames: updatedWishes };
          }
          return l;
        })
      );
    } catch (e) {
      console.error('Error removing from wishlist:', e);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="steam-shell">
      <div style={{ marginTop: '80px' }}>
        <button onClick={onBack} className="btn-back">← Назад</button>
        <div className="auth-container">
          <h2 className="auth-title">Список желаемого</h2>

          {!user ? <div className="games-empty">Войдите, чтобы использовать список желаемого</div> : null}
          {loading ? <div className="games-loading">Загрузка...</div> : null}
          {error ? <div className="games-error">Ошибка: {error}</div> : null}

          {!loading && !error && user && (
            Array.isArray(wishGames) && wishGames.length ? (
              <div>
                <div className="games-list">
                  {wishGames.map((g) => (
                    <div key={g.id || g.Id || g.name || g.Name} style={{ position: 'relative' }}>
                      <CreateGameCard
                        game={{
                          ...g,
                          id: g.id || g.Id,
                          name: g.name || g.Name,
                        }}
                        onClick={() => onGameClick && onGameClick(g)}
                      />
                      <button
                        className="btn-remove-wishlist"
                        type="button"
                        onClick={() => handleRemoveGame(g.id || g.Id)}
                        disabled={removing}
                        title="Удалить из списка желаемого"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="games-empty">Список желаемого пуст</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

