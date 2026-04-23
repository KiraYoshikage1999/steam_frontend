import React from 'react';

export default function CreateGameCard({ game, onClick }) {
  const posterUrl = game?.poster?.url || game?.images?.[0]?.url || '';
  const genres = Array.isArray(game?.genres)
    ? game.genres.map((genre) => genre.name).filter(Boolean).join(', ')
    : '';
  const rating = game?.rating ?? null;
  const price = Number(game?.price ?? 0);
  const discount = Number(game?.discount ?? 0);
  const discountedPrice = discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price.toFixed(2);

  return (
    <div className="game-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div
        className="game-card-cover"
        style={{ backgroundImage: posterUrl ? `url(${posterUrl})` : undefined }}
      >
        {!posterUrl && <div className="game-card-cover-empty">Нет обложки</div>}
      </div>

      <div className="game-card-body">
        <div className="game-card-title-row">
          <h3 className="game-card-title">{game?.name || 'Без названия'}</h3>
          {rating !== null && <span className="game-card-rating">{rating.toFixed(1)}</span>}
        </div>

        {genres && <div className="game-card-genres">{genres}</div>}
        {game?.description && <p className="game-card-description">{game.description}</p>}

        <div className="game-card-footer">
          <div className="game-card-price-wrap">
            {discount > 0 && (
              <span className="game-card-price-old">{price.toFixed(2)}€</span>
            )}
            <span className="game-card-price-current">{discountedPrice}€</span>
          </div>
          {discount > 0 && <span className="game-card-discount">-{discount}%</span>}
        </div>
      </div>
    </div>
  );
}
