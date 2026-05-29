import React, { useState, useEffect } from 'react';
import { resolveAssetUrl, resolveGameAssetPath } from '../utils/resolveAssetUrl';
import { addToWishList, removeFromWishList } from '../Functional/WishList/WishListService';

const API_BASE = 'https://26.185.217.20:7219';

export default function GameDetail({ gameId, game, onBack, user, onAddToCart, cartItems, wishListGames, onWishListUpdate, onGoToLibrary }) {
  const [statusMessage, setStatusMessage] = useState('');
  const [dlcs, setDlcs] = useState([]);
  const [dlcsLoading, setDlcsLoading] = useState(true);

  const gameIdentifier = game?.id || game?.Id || gameId;
  const purchasedGames = Array.isArray(user?.PurchasedGames)
    ? user.PurchasedGames
    : user?.purchasedGames || [];
  const alreadyOwned = Boolean(
    gameIdentifier && purchasedGames.some((item) => (item?.id || item?.Id) === gameIdentifier)
  );
  const alreadyInCart = Boolean(
    gameIdentifier && Array.isArray(cartItems) && cartItems.some((item) => (item?.id || item?.Id) === gameIdentifier)
  );
  const inWishList = Boolean(
    gameIdentifier && Array.isArray(wishListGames) && wishListGames.some((item) => (item?.id || item?.Id) === gameIdentifier)
  );
  const posterUrl = resolveAssetUrl(resolveGameAssetPath(game));
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

  // Load DLCs for this game
  useEffect(() => {
    if (!gameIdentifier) {
      setDlcsLoading(false);
      return;
    }

    const fetchDlcs = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/DLC/get-all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const dlcsArray = Array.isArray(data) ? data : (data?.data ?? []);
        
        // Filter DLCs that belong to this game
        const gameDlcs = dlcsArray.filter(dlc => 
          (dlc?.gameId || dlc?.GameId || dlc?.game?.id) === gameIdentifier &&
          (dlc?.isDLC || dlc?.IsDLC || false)
        );
        
        setDlcs(gameDlcs);
      } catch (err) {
        console.warn('Failed to load DLCs:', err);
        setDlcs([]);
      } finally {
        setDlcsLoading(false);
      }
    };

    fetchDlcs();
  }, [gameIdentifier]);

  if (!game) {
    return (
      <div className="game-detail">
        <button onClick={onBack} className="btn-back">Back</button>
        <div className="game-detail-error">Game not found</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setStatusMessage('');

    if (!gameIdentifier) {
      setStatusMessage('Не удалось определить игру для корзины.');
      return;
    }

    if (alreadyOwned) {
      setStatusMessage('Эта игра уже есть в вашей библиотеке.');
      return;
    }

    if (!onAddToCart) {
      setStatusMessage('Функция корзины недоступна.');
      return;
    }

    onAddToCart(game);
    setStatusMessage('Игра добавлена в корзину. Перейдите в корзину для покупки.');
  };

  const handleGoToLibrary = () => {
    if (onGoToLibrary) {
      onGoToLibrary();
    } else if (onBack) {
      onBack();
    }
  };

  const handleWishListToggle = async () => {
    setStatusMessage('');

    if (!user) {
      setStatusMessage('Требуется войти, чтобы добавить в список желаемого.');
      return;
    }

    if (!gameIdentifier) {
      setStatusMessage('Не удалось определить игру.');
      return;
    }

    const userId = user?.id || user?.userId || user?.Id || user?.UserId || null;
    if (!userId) {
      setStatusMessage('ID пользователя не найден.');
      return;
    }

    try {
      if (inWishList) {
        await removeFromWishList(userId, gameIdentifier);
        setStatusMessage('Удалено из списка желаемого.');
      } else {
        await addToWishList(userId, gameIdentifier);
        setStatusMessage('Добавлено в список желаемого.');
      }
      if (onWishListUpdate) {
        onWishListUpdate();
      }
    } catch (error) {
      setStatusMessage(error?.message || 'Не удалось обновить список желаемого.');
    }
  };

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

          {!dlcsLoading && dlcs.length > 0 && (
            <div className="game-detail-section">
              <h2 className="game-detail-section-title">Дополнительный контент</h2>
              <div className="dlcs-list">
                {dlcs.map((dlc) => (
                  <div key={dlc?.id || dlc?.Id} className="dlc-item">
                    <div className="dlc-info">
                      <h3 className="dlc-name">{dlc?.name || dlc?.Name || 'DLC'}</h3>
                      {dlc?.description && <p className="dlc-description">{dlc.description}</p>}
                    </div>
                    <div className="dlc-price">
                      {dlc?.price && <span className="dlc-price-value">{Number(dlc.price).toFixed(2)}€</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="game-detail-purchase">
            <div className="game-detail-price-wrap">
              {discount > 0 && (
                <span className="game-detail-price-old">{price.toFixed(2)}€</span>
              )}
              <span className="game-detail-price-current">{discountedPrice}€</span>
              {discount > 0 && <span className="game-detail-discount-badge">-{discount}%</span>}
            </div>
            <button
              className="btn-buy"
              type="button"
              onClick={alreadyOwned ? handleGoToLibrary : handleAddToCart}
              disabled={alreadyInCart}
            >
              {alreadyOwned ? 'Перейти в библиотеку' : alreadyInCart ? 'В корзине' : 'Добавить в корзину'}
            </button>
            <button className="btn-wishlist" type="button" onClick={handleWishListToggle}>
              {inWishList ? '❤️ В списке желаемого' : '🤍 В список желаемого'}
            </button>
            {statusMessage ? <div className="game-detail-status">{statusMessage}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
