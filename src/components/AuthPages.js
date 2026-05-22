import React, { useEffect, useState } from 'react';
import { authMethods } from '../Functional/Auth/authMethods';

export default function AuthPages({ user, onUserChange, onBack }) {
  const [currentPage, setCurrentPage] = useState(user ? 'profile' : 'menu'); // 'menu', 'login', 'register', 'profile'

  const handleLogout = async () => {
    try {
      await authMethods.logout(user?.refreshToken || user?.RefreshToken);
    } catch {
      // ignore
    }
    onUserChange?.(null);
    setCurrentPage('menu');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onBack={onBack}
            onSuccess={(nextUser) => {
              onUserChange?.(nextUser);
              setCurrentPage('profile');
            }}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onBack={onBack}
            onSuccess={(nextUser) => {
              onUserChange?.(nextUser);
              setCurrentPage('profile');
            }}
          />
        );
      case 'profile':
        return <ProfilePage user={user} onLogout={handleLogout} onBack={onBack} onUserChange={onUserChange} />;
      default:
        return <AuthMenu onNavigate={setCurrentPage} onBack={onBack} />;
    }
  };

  return <div className="auth-pages">{renderPage()}</div>;
}

function AuthMenu({ onNavigate, onBack }) {
  return (
    <div className="auth-menu">
      <div className="auth-menu-container">
        <button onClick={onBack} className="btn-back">← Назад</button>
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

function LoginPage({ onBack, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authMethods.login(email, password);
      const nextUser = {
        email,
        accessToken: data?.AccessToken || data?.accessToken || data?.token || data?.Token || data?.access_token,
        refreshToken: data?.RefreshToken || data?.refreshToken || data?.refresh_token,
        ...(data && typeof data === 'object' ? data : {}),
      };

      // hydrate profile from backend if possible
      try {
        authMethods.saveAuth(nextUser);
        const profile = await authMethods.getCurrentUser();
        if (profile && typeof profile === 'object') Object.assign(nextUser, profile);
      } catch {
        // ignore: profile endpoint may fail, still logged in with tokens
      }

      onSuccess?.(nextUser);
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

function RegisterPage({ onBack, onSuccess }) {
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
      const data = await authMethods.register(username, email, password);
      const nextUser = {
        username,
        email,
        accessToken: data?.AccessToken || data?.accessToken || data?.token || data?.Token || data?.access_token,
        refreshToken: data?.RefreshToken || data?.refreshToken || data?.refresh_token,
        ...(data && typeof data === 'object' ? data : {}),
      };

      try {
        authMethods.saveAuth(nextUser);
        const profile = await authMethods.getCurrentUser();
        if (profile && typeof profile === 'object') Object.assign(nextUser, profile);
      } catch {
        // ignore
      }

      onSuccess?.(nextUser);
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

function ProfilePage({ user, onLogout, onBack, onUserChange }) {
  const safeUser = user || null;
  const categories = safeUser
    ? [
        { id: 'changes', label: 'Изменения' },
        { id: 'transactions', label: 'Транзакции' },
        { id: 'developer', label: 'Режим разработчика' },
      ]
    : [
        { id: 'account', label: 'Аккаунт' },
        { id: 'developer', label: 'Режим разработчика' },
      ];

  const [selectedSection, setSelectedSection] = useState(categories[0]?.id || '');
  const [editUserName, setEditUserName] = useState(safeUser?.UserName || safeUser?.username || '');
  const [editEmail, setEditEmail] = useState(safeUser?.Email || safeUser?.email || '');
  const [editIconUrl, setEditIconUrl] = useState(safeUser?.IconUrl || safeUser?.iconUrl || safeUser?.icon?.url || '');
  const [avatarPreview, setAvatarPreview] = useState(safeUser?.IconUrl || safeUser?.iconUrl || safeUser?.icon?.url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devMode, setDevMode] = useState(() => localStorage.getItem('steam-frontend.devMode') === 'true');

  useEffect(() => {
    setEditUserName(safeUser?.UserName || safeUser?.username || '');
    setEditEmail(safeUser?.Email || safeUser?.email || '');
    setEditIconUrl(safeUser?.IconUrl || safeUser?.iconUrl || safeUser?.icon?.url || '');
    setAvatarPreview(safeUser?.IconUrl || safeUser?.iconUrl || safeUser?.icon?.url || '');
  }, [safeUser]);

  const displayName =
    safeUser?.UserName || safeUser?.username || safeUser?.userName || safeUser?.name || safeUser?.email || 'Пользователь';
  const dateOfReg = safeUser?.DateOfReg || safeUser?.dateOfReg || null;
  const purchasedGames = safeUser?.PurchasedGames || safeUser?.purchasedGames || [];
  const transactions = safeUser?.transactions || safeUser?.Transactions || [];
  const rawToken = safeUser?.accessToken || safeUser?.AccessToken || authMethods.getAccessToken();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setAvatarPreview(result);
      setEditIconUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        userName: editUserName,
        UserName: editUserName,
        email: editEmail,
        Email: editEmail,
        iconUrl: avatarPreview || editIconUrl,
        IconUrl: avatarPreview || editIconUrl,
      };

      const updated = await authMethods.updateProfile(payload);
      const nextUser = {
        ...(safeUser || {}),
        ...(updated && typeof updated === 'object' ? updated : {}),
        userName: payload.userName,
        UserName: payload.UserName,
        email: payload.email,
        Email: payload.Email,
        iconUrl: payload.iconUrl,
        IconUrl: payload.IconUrl,
        accessToken: rawToken,
      };
      authMethods.saveAuth(nextUser);
      onUserChange?.(nextUser);
      setSuccess('Сохранено');
    } catch (e) {
      setError(e?.message || 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDevMode = () => {
    const next = !devMode;
    setDevMode(next);
    localStorage.setItem('steam-frontend.devMode', String(next));
  };

  const renderAccountSection = () => {
    if (!safeUser) {
      return (
        <div className="profile-empty">
          <p>Чтобы изменить аккаунт, войдите в систему.</p>
          <button type="button" className="btn-submit" onClick={onBack}>
            Войти / зарегистрироваться
          </button>
        </div>
      );
    }

    return (
      <div className="profile-section">
        <div className="profile-info-block">
          <div className="profile-avatar-preview-wrapper">
            {avatarPreview ? (
              <img className="profile-avatar-preview" src={avatarPreview} alt="avatar preview" />
            ) : (
              <div className="profile-avatar-empty">Нет фото</div>
            )}
          </div>
          <div className="profile-summary">
            <div className="profile-summary-name">{displayName}</div>
            {dateOfReg ? <div className="profile-summary-meta">Дата регистрации: {String(dateOfReg)}</div> : null}
            <div className="profile-summary-meta">Куплено игр: {Array.isArray(purchasedGames) ? purchasedGames.length : 0}</div>
          </div>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="profile_username">Имя пользователя</label>
            <input
              id="profile_username"
              type="text"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
              placeholder="UserName"
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile_email">Email</label>
            <input
              id="profile_email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile_avatar">Аватар из проводника</label>
            <input id="profile_avatar" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="profile_icon">Или ссылка на аватар</label>
            <input
              id="profile_icon"
              type="text"
              value={editIconUrl}
              onChange={(e) => setEditIconUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <button type="button" className="btn-submit" onClick={handleSave} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          {error ? <div className="auth-error">{error}</div> : null}
          {success ? <div className="auth-success">{success}</div> : null}
        </div>
      </div>
    );
  };

  const renderTransactionsSection = () => {
    const purchasedGamesList = Array.isArray(purchasedGames) ? purchasedGames : [];
    const knownTransactions = Array.isArray(transactions) ? transactions : [];

    if (!knownTransactions.length && !purchasedGamesList.length) {
      return <div className="profile-empty">Пока нет транзакций.</div>;
    }

    return (
      <div className="profile-section">
        {knownTransactions.length > 0 && (
          <>
            <div className="profile-subsection-title">Транзакции</div>
            {knownTransactions.map((transaction, index) => (
              <div key={`t-${index}`} className="transaction-item">
                <div>{transaction.description || transaction.title || 'Транзакция'}</div>
                <div>{transaction.amount != null ? `${transaction.amount}€` : ''}</div>
              </div>
            ))}
          </>
        )}

        {purchasedGamesList.length > 0 && (
          <>
            <div className="profile-subsection-title">Купленные игры</div>
            {purchasedGamesList.map((game, index) => (
              <div key={`g-${game?.id || game?.Id || index}`} className="transaction-item">
                <div>{game?.name || game?.Name || 'Игра'}</div>
                <div>{(Number(game?.price ?? game?.Price) || 0).toFixed(2)}€</div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  const renderDeveloperSection = () => (
    <div className="profile-section">
      <div className="form-group">
        <label>Режим разработчика</label>
        <button type="button" className="btn-submit" onClick={handleToggleDevMode}>
          {devMode ? 'Отключить режим разработчика' : 'Включить режим разработчика'}
        </button>
      </div>
      <div className="form-group">
        <label>Токен фронтенда</label>
        <textarea readOnly value={rawToken || 'Токен не найден'} rows={6} />
      </div>
      <div className="profile-help-text">
        В этом режиме включаются расширенные функции и отладка. Здесь вы можете увидеть используемый токен.
      </div>
    </div>
  );

  return (
    <div className="auth-page profile-page">
      <button onClick={onBack} className="btn-back">← Назад</button>
      <div className="profile-shell">
        <aside className="profile-sidebar">
          <div className="profile-sidebar-title">Профиль</div>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`profile-sidebar-btn ${selectedSection === item.id ? 'active' : ''}`}
              onClick={() => setSelectedSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </aside>

        <section className="profile-content">
          {selectedSection === 'changes' || selectedSection === 'account'
            ? renderAccountSection()
            : selectedSection === 'transactions'
            ? renderTransactionsSection()
            : renderDeveloperSection()}
        </section>
      </div>
    </div>
  );
}
