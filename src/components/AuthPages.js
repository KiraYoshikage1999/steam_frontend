import React, { useState } from 'react';
import { authMethods } from '../Functional/Auth/authMethods';

export default function AuthPages() {
  const [currentPage, setCurrentPage] = useState('menu'); // 'menu', 'login', 'register', 'profile'

  const handleLogout = () => {
    // TODO: implement logout
    setCurrentPage('menu');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onBack={() => setCurrentPage('menu')} />;
      case 'register':
        return <RegisterPage onBack={() => setCurrentPage('menu')} />;
      case 'profile':
        return <ProfilePage onLogout={handleLogout} />;
      default:
        return <AuthMenu onNavigate={setCurrentPage} />;
    }
  };

  return <div className="auth-pages">{renderPage()}</div>;
}

function AuthMenu({ onNavigate }) {
  return (
    <div className="auth-menu">
      <div className="auth-menu-container">
        <h1 className="auth-menu-title">Аккаунт</h1>
        <button className="auth-menu-btn" onClick={() => onNavigate('login')}>
          Войти
        </button>
        <button className="auth-menu-btn secondary" onClick={() => onNavigate('register')}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}

function LoginPage({ onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authMethods.login(email, password);
    } catch (err) {
      setError(err?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="auth-page">
      <button onClick={onBack} className="btn-back">← Назад</button>
      <div className="auth-container">
        <h2 className="auth-title">Вход в аккаунт</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>
          <button type="submit" className="btn-submit">Войти</button>
          {error ? <div className="auth-error">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}

function RegisterPage({ onBack }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }

    setError('');
    try {
      await authMethods.register(username, email, password);
    } catch (err) {
      setError(err?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="auth-page">
      <button onClick={onBack} className="btn-back">← Назад</button>
      <div className="auth-container">
        <h2 className="auth-title">Регистрация</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm">Подтвердите пароль</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Повторите пароль"
              required
            />
          </div>
          <button type="submit" className="btn-submit">Зарегистрироваться</button>
          {error ? <div className="auth-error">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}

function ProfilePage({ onLogout }) {
  const user = null; // TODO: get user from context/state

  if (!user) {
    return (
      <div className="auth-page">
        <button onClick={onLogout} className="btn-back">← Назад</button>
        <div className="auth-container">
          <div className="profile-empty">Вы не авторизованы</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <button onClick={onLogout} className="btn-back">Выход</button>
      <div className="auth-container">
        <h2 className="auth-title">Мой профиль</h2>
        <div className="profile-info">
          {/* TODO: render user profile info */}
          <p>Профиль пользователя</p>
        </div>
      </div>
    </div>
  );
}
