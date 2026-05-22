import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="steam-shell">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-company">Triple_Brain</div>
            <p className="footer-description">Платформа для покупки и управления цифровыми играми</p>
          </div>
          <div className="footer-section">
            <div className="footer-title">Компания</div>
            <ul className="footer-links">
              <li><a href="#about">О нас</a></li>
              <li><a href="#careers">Карьера</a></li>
              <li><a href="#blog">Блог</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <div className="footer-title">Поддержка</div>
            <ul className="footer-links">
              <li><a href="#support">Помощь</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Контакты</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <div className="footer-title">Правовая информация</div>
            <ul className="footer-links">
              <li><a href="#privacy">Политика конфиденциальности</a></li>
              <li><a href="#terms">Условия использования</a></li>
              <li><a href="#cookies">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Triple_Brain. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
