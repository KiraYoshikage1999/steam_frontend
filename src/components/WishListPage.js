import React, { useEffect, useState } from 'react';
import CreateGameCard from '../Functional/Games/CreateGameCard';
import { getWishList, removeFromWishList } from '../Functional/WishList/WishListService';

export default function WishListPage({ user, onBack, onGameClick }) {
  const [wishList, setWishList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(false);

  const getUserId = (userObj) =>
    userObj?.id || userObj?.userId || userObj?.Id || userObj?.UserId ||
    userObj?.user?.id || userObj?.user?.userId || userObj?.user?.Id || userObj?.user?.UserId ||
    null;

  useEffect(() => {
    let cancelled = false;
    const userId = getUserId(user);
    if (!userId) {
      setWishList(null);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getWishList(userId);
        const data = response?.data ?? response ?? null;
        if (!cancelled) {
          setWishList(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Не удалось загрузить список желаемого');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const userId = getUserId(user);
  const wishGames = wishList?.wishGames || wishList?.WishGames || [];

  const handleRemoveGame = async (gameId) => {
    if (!userId) return;
    setRemoving(true);
    try {
      const updated = await removeFromWishList(userId, gameId);
      const updatedList = updated?.data ?? updated ?? wishList;
      if (updatedList) {
        setWishList(updatedList);
      } else {
        setWishList((prev) => ({
          ...prev,
          wishGames: Array.isArray(wishGames)
            ? wishGames.filter((g) => (g.id || g.Id) !== gameId)
            : wishGames,
          WishGames: Array.isArray(wishGames)
            ? wishGames.filter((g) => (g.id || g.Id) !== gameId)
            : wishGames,
        }));
      }
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

