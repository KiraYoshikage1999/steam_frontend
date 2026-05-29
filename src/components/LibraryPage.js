import React, { useState } from 'react';
import { resolveAssetUrl, resolveGameAssetPath } from '../utils/resolveAssetUrl';
import { authMethods } from '../Functional/Auth/authMethods';

export default function LibraryPage({ user, onBack, onGameClick }) {
  const purchasedGames = user?.PurchasedGames || user?.purchasedGames || [];
  const [refunding, setRefunding] = useState(null);
  const [confirmRefund, setConfirmRefund] = useState(null);
  const [error, setError] = useState('');
  const [refundedGames, setRefundedGames] = useState([]);

  const getPosterUrlRaw = (game) => resolveGameAssetPath(game);

  const handleRefundClick = (game) => {
    setConfirmRefund(game?.id || game?.Id);
    setError('');
  };

  const handleRefundConfirm = async (gameId) => {
    setRefunding(gameId);
    setError('');
    try {
      await authMethods.refundGame(gameId);
      setRefundedGames([...refundedGames, gameId]);
      setConfirmRefund(null);
    } catch (e) {
      setError(e?.message || 'Не удалось обработать возврат');
    } finally {
      setRefunding(null);
    }
  };

  const handleCancelRefund = () => {
    setConfirmRefund(null);
    setError('');
  };

  return (
    <div className="steam-shell">
      <div style={{ marginTop: '80px' }}>
        <button onClick={onBack} className="btn-back">← Назад</button>
        <div className="auth-container">
          <h2 className="auth-title">Библиотека</h2>
          {!user ? (
            <div className="games-empty">Войдите, чтобы увидеть библиотеку</div>
          ) : Array.isArray(purchasedGames) && purchasedGames.length ? (
            <div>
              {error && <div className="games-error">{error}</div>}
              <div className="library-items">
                {purchasedGames.map((g) => {
                  const game = {
                    ...g,
                    id: g.id || g.Id,
                    name: g.name || g.Name,
                  };
                  const gameId = game.id || game.Id;
                  const isRefunded = refundedGames.includes(gameId);
                  const posterUrl = resolveAssetUrl(getPosterUrlRaw(g));
                  const genres = Array.isArray(game?.genres)
                    ? game.genres.map((genre) => genre.name).filter(Boolean).join(', ')
                    : '';

                  if (isRefunded) return null; // Hide refunded games

                  return (
                    <div
                      key={gameId || game.name || Math.random()}
                      className="library-item-wrapper"
                    >
                      <button
                        type="button"
                        className="library-item"
                        onClick={() => onGameClick && onGameClick(game)}
                      >
                        <div
                          className="library-item-cover"
                          style={{ backgroundImage: posterUrl ? `url(${posterUrl})` : undefined }}
                        >
                          {!posterUrl && <div className="library-item-cover-empty">Нет обложки</div>}
                        </div>
                        <div className="library-item-info">
                          <div className="library-item-title">{game.name || 'Без названия'}</div>
                          <div className="library-item-meta">
                            {genres && <span className="library-item-genres">{genres}</span>}
                            <span className="library-item-status">Куплено</span>
                          </div>
                        </div>
                      </button>
                      {confirmRefund === gameId ? (
                        <div className="library-item-refund-confirm">
                          <p>Вы уверены, что хотите отказаться от этой игры?</p>
                          <div className="library-item-refund-buttons">
                            <button
                              type="button"
                              className="btn-small danger"
                              onClick={() => handleRefundConfirm(gameId)}
                              disabled={refunding === gameId}
                            >
                              {refunding === gameId ? 'Обработка...' : 'Подтвердить'}
                            </button>
                            <button
                              type="button"
                              className="btn-small secondary"
                              onClick={handleCancelRefund}
                              disabled={refunding === gameId}
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="library-item-refund-btn"
                          onClick={() => handleRefundClick(game)}
                          title="Отказаться от игры"
                        >
                          ↩️ Отказ
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="games-empty">Пока нет купленных игр</div>
          )}
        </div>
      </div>
    </div>
  );
}

