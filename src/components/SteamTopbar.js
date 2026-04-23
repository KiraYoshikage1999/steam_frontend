export default function SteamTopbar({ onAuthClick }) {
  return (
    <div className="steam-navbar">
      <div className="steam-topbar">
        <div className="steam-brand">
          <div className="steam-logo-mark">S</div>
          <div className="steam-logo-text">STEAM</div>
        </div>

        <div className="steam-header-links">
          <a href="#" className="active">Магазин</a>
          <a href="#">Сообщество</a>
          <a href="#">О сервисе</a>
          <a href="#">Чат</a>
          <a href="#">Поддержка</a>
        </div>

        <div className="steam-user-actions">
          <button className="steam-btn secondary">Установить Steam</button>
          <button className="steam-icon-btn" aria-label="Уведомления">🔔</button>
          <div className="steam-wallet">98,64€</div>
          <button className="steam-user-btn" onClick={onAuthClick}>👤 Профиль ▾</button>
        </div>
      </div>

      <div className="steam-subnav">
        <div className="steam-subnav-links">
          <a href="#">Просмотр ▾</a>
          <a href="#">Рекомендации ▾</a>
          <a href="#">Категории ▾</a>
          <a href="#">Способы игры ▾</a>
          <a href="#">Особые разделы ▾</a>
        </div>
        <div className="steam-subnav-actions">
          <div className="steam-search-box">
            <input type="text" placeholder="Поиск по магазину" />
            <button>🔍</button>
          </div>
          <button className="steam-wishlist">★ Список желаемого 9</button>
        </div>
      </div>
    </div>
  );
}
