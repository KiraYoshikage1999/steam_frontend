import React from 'react';

export default function GameDetail({ gameId, game, onBack }) {
  if (!game) {
    return (
      <div className="game-detail">
        <button onClick={onBack} className="btn-back">Back</button>
        <div className="game-detail-error">Game not found</div>
      </div>
    );
  }

  const posterUrl = game?.poster?.url || game?.images?.[0]?.url || '';
  const genres = Array.isArray(game?.genres)
    ? game.genres.map((genre) => genre.name).filter(Boolean).join(', ')
    : '';
  const rating = game?.rating ?? 'N/A';
  const price = Number(game?.price ?? 0);
  const discount = Number(game?.discount ?? 0);
  const discountedPrice = discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price.toFixed(2);
  const developer = game?.developer === '00000000-0000-0000-0000-000000000000' 
    ? 'Unknown Developer'
    : (game?.developer || 'Unknown Developer');

  return (
    <div className="game-detail">
      <button onClick={onBack} className="btn-back">← Назад</button>
      
      <div className="game-detail-container">
        <div className="game-detail-hero">
          {posterUrl ? (
            <img src={posterUrl} alt={game?.name} className="game-detail-hero-img" />
          ) : (
            <div className="game-detail-hero-empty">Нет обложки</div>
          )}
        </div>

        <div className="game-detail-info">
          <div className="game-detail-header">
            <div>
              <h1 className="game-detail-title">{game?.name || 'Без названия'}</h1>
              <div className="game-detail-meta">
                {genres && <span className="game-detail-genres">{genres}</span>}
                <span className="game-detail-rating">Оценка: {rating}</span>
              </div>
            </div>
            <div className="game-detail-rating-badge">{rating}</div>
          </div>

          {game?.description && (
            <div className="game-detail-section">
              <h2 className="game-detail-section-title">Описание</h2>
              <p className="game-detail-description">{game.description}</p>
            </div>
          )}

          <div className="game-detail-section">
            <h2 className="game-detail-section-title">Информация</h2>
            <div className="game-detail-stats">
              <div className="game-detail-stat">
                <span className="stat-label">Разработчик:</span>
                <span className="stat-value">{developer}</span>
              </div>
              <div className="game-detail-stat">
                <span className="stat-label">Дата выпуска:</span>
                <span className="stat-value">{game?.createdAt ? new Date(game.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="game-detail-purchase">
            <div className="game-detail-price-wrap">
              {discount > 0 && (
                <span className="game-detail-price-old">{price.toFixed(2)}€</span>
              )}
              <span className="game-detail-price-current">{discountedPrice}€</span>
              {discount > 0 && <span className="game-detail-discount-badge">-{discount}%</span>}
            </div>
            <button className="btn-buy">Купить сейчас</button>
            <button className="btn-wishlist">❤️ В список желаемого</button>
          </div>
        </div>
      </div>
    </div>
  );
}
