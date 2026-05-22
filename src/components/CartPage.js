import React from 'react';
import { resolveAssetUrl } from '../utils/resolveAssetUrl';

export default function CartPage({ cartItems, user, onBack, onRemove, onCheckout, checkoutStatus, checkoutProcessing }) {
  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item?.price ?? item?.Price ?? 0), 0);

  return (
    <div className="steam-shell">
      <div style={{ marginTop: '80px' }}>
        <button onClick={onBack} className="btn-back">← Назад</button>
        <div className="auth-container">
          <h2 className="auth-title">Корзина</h2>
          {cartItems.length === 0 ? (
            <div className="games-empty">Корзина пуста. Выберите игру в магазине.</div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((game) => {
                  const gameId = game?.id || game?.Id;
                  const posterUrl = resolveAssetUrl(game?.poster?.url || game?.poster?.Url || game?.images?.[0]?.url || game?.images?.[0]?.Url || '');
                  const price = Number(game?.price ?? game?.Price ?? 0).toFixed(2);
                  return (
                    <div key={gameId || game?.name || Math.random()} className="cart-item">
                      <div className="cart-item-cover" style={{ backgroundImage: posterUrl ? `url(${posterUrl})` : undefined }}>
                        {!posterUrl && <div className="cart-item-cover-empty">Нет обложки</div>}
                      </div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{game?.name || game?.Name || 'Без названия'}</div>
                        <div className="cart-item-price">{price}€</div>
                        <button className="btn-remove" type="button" onClick={() => onRemove(gameId)}>
                          Удалить
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Всего товаров</span>
                  <strong>{cartItems.length}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>Общая сумма</span>
                  <strong>{totalPrice.toFixed(2)}€</strong>
                </div>
                <button className="btn-submit" type="button" onClick={onCheckout} disabled={checkoutProcessing}>
                  {checkoutProcessing ? 'Обработка...' : 'Купить все'}
                </button>
                {checkoutStatus ? <div className="auth-success" style={{ marginTop: 12 }}>{checkoutStatus}</div> : null}
              </div>
            </>
          )}
          {!user && <div className="games-empty">Войдите, чтобы завершить покупку.</div>}
        </div>
      </div>
    </div>
  );
}
