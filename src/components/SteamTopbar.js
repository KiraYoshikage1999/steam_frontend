import React, { useState } from 'react';
import CategoryDropdown from './CategoryDropdown';

export default function SteamTopbar({
  onAuthClick,
  onHomeClick,
  onLibraryClick,
  onWishListClick,
  onCartClick,
  cartCount,
  user,
  activePage,
  categories,
  onCategorySelect,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifications = [];

  const avatarUrl = user?.IconUrl || user?.iconUrl || user?.icon?.url || user?.Avatar || user?.avatarUrl || '';
  const displayName = user?.UserName || user?.username || user?.userName || user?.name || user?.email || 'Профиль';

  // Структура категорий по умолчанию, если не передана
  const categoryMenu = categories || [
    { title: 'Жанры', items: [] },
  ];

  return (
    <div className="steam-navbar">
      <div className="steam-topbar">
        <button
          type="button"
          className="steam-brand"
          onClick={onHomeClick}
          aria-label="На главную"
        >
          <div className="steam-logo-mark">S</div>
          <div className="steam-logo-text">Stish</div>
        </button>

        <div className="steam-header-links">
          <button
            type="button"
            className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={onHomeClick}
          >
            Магазин
          </button>
          <button
            type="button"
            className={`nav-link ${activePage === 'library' ? 'active' : ''}`}
            onClick={onLibraryClick}
          >
            Библиотека
          </button>
        </div>

        <div className="steam-user-actions">
          <button className="steam-cart-btn" onClick={onCartClick} type="button" aria-label="Корзина">
            🛒{cartCount ? ` ${cartCount}` : ''}
          </button>
          <div className="notification-wrapper">
            <button
              className="steam-icon-btn"
              aria-label="Уведомления"
              onClick={() => setNotificationsOpen((value) => !value)}
              type="button"
            >
              🔔
            </button>
            {notificationsOpen && (
              <div className="notification-panel">
                {notifications.length === 0 ? (
                  <div className="notification-empty">никаких сообщений нет</div>
                ) : (
                  notifications.map((note, index) => (
                    <div className="notification-item" key={index}>
                      <div className="notification-item-title">{note.title}</div>
                      <div className="notification-item-body">{note.body}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <button className="steam-user-btn" onClick={onAuthClick} type="button">
            {avatarUrl ? <img className="steam-user-avatar" src={avatarUrl} alt={displayName} /> : '👤'}
            {displayName} ▾
          </button>
        </div>
      </div>

      <div className="steam-subnav">
        <div className="steam-subnav-links">
          {categoryMenu.map((category, index) => (
            <CategoryDropdown
              key={category?.title || index}
              title={category.title}
              items={category.items}
              onSelectItem={(item) => onCategorySelect && onCategorySelect(category.title, item)}
            />
          ))}
        </div>
        <div className="steam-subnav-actions">
          <div className="steam-search-box">
            <input type="text" placeholder="Поиск по магазину" />
            <button type="button">🔍</button>
          </div>
          <button className="steam-wishlist" onClick={onWishListClick} type="button">★ Список желаемого</button>
        </div>
      </div>
    </div>
  );
}
