// Auth API methods
// TODO: Connect to backend API endpoints
import log from "../../utils/Logger"

const API_BASE = 'https://localhost:7219';
const AUTH_STORAGE_KEY = 'steam-frontend.authUser';
//Forming for server Errors
function formatServerError(data) {
  log.debug("FormatServerError start working");
  if (!data) {
    log.error("{data} is empty", data);
    return null;
  }

  if (typeof data === 'string') return data;

  if (typeof data === 'object') {
    if (typeof data.message === 'string') return data.message;
    if (typeof data.title === 'string') return data.title;
    if (typeof data.error === 'string') return data.error;

    // ASP.NET ValidationProblemDetails: { errors: { Field: ["msg1","msg2"] } }
    if (data.errors && typeof data.errors === 'object') {
      const parts = [];
      for (const [field, messages] of Object.entries(data.errors)) {
        if (Array.isArray(messages)) {
          for (const m of messages) parts.push(field ? `${field}: ${m}` : String(m));
        } else if (messages) {
          parts.push(field ? `${field}: ${String(messages)}` : String(messages));
        }
      }
      if (parts.length) return parts.join('\n');
    }
  }

  return null;
}

async function readResponseData(response) {
  const text = await response.text().catch(() => '');
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeTokenPayload(payload) {
  if (!payload || typeof payload !== 'object') return null;
  return (
    payload.accessToken ||
    payload.AccessToken ||
    payload.token ||
    payload.Token ||
    payload.access_token ||
    null
  );
}

function saveAuth(next) {
  try {
    if (next) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      const token = normalizeTokenPayload(next);
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('accessToken');
    }
  } catch {
    // ignore
  }
}

function getAccessToken() {
  const auth = loadAuth();
  return normalizeTokenPayload(auth) || localStorage.getItem('accessToken') || null;
}

function authHeaders(extra = {}) {
  const token = getAccessToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getAuthHeader(extra = {}) {
  return authHeaders(extra);
}

export const authMethods = {
  // Register a new user
  async register(username, email, password) {
    try {
      const payload = {
        // common variants for ASP.NET / DTO naming
        username,
        userName: username,
        email,
        password,
        // common "confirm password" variants (extra fields are ignored by most servers)
        passwordConfirm: password,
        confirmPassword: password,
        passwordConfirmation: password,
      };

      const response = await fetch(`${API_BASE}/api/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await readResponseData(response);

      if (!response.ok) {
        const message = formatServerError(data) || `Register failed (${response.status})`;
        console.error('Register failed:', response.status, data);
        throw new Error(message);
      }

      console.log('Register success:', data);
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      const payload = {
        email,
        password,
        // sometimes backend uses UserName for login, allow typing email there too
        userName: email,
        username: email,
      };

      const response = await fetch(`${API_BASE}/api/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await readResponseData(response);

      if (!response.ok) {
        const message = formatServerError(data) || `Login failed (${response.status})`;
        console.error('Login failed:', response.status, data);
        throw new Error(message);
      }

      saveAuth(data);
      console.log('Login success:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout(refreshToken) {
    try {
      // Если потребуется, здесь можно добавить revoke-запрос на бэкенд.
      saveAuth(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      saveAuth(null);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE}/api/Users/me`, {
        method: 'GET',
        headers: authHeaders(),
      });

      const data = await readResponseData(response);
      if (!response.ok) {
        const message = formatServerError(data) || `Get profile failed (${response.status})`;
        console.error('GetCurrentUser failed:', response.status, data);
        throw new Error(message);
      }

      return data;
    } catch (error) {
      console.error('GetCurrentUser error:', error);
      throw error;
    }
  },

  async updateProfile(profile) {
    try {
      const response = await fetch(`${API_BASE}/api/Users/update-account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(profile),
      });

      const data = await readResponseData(response);
      if (!response.ok) {
        const message = formatServerError(data) || `Update profile failed (${response.status})`;
        console.error('UpdateProfile failed:', response.status, data);
        throw new Error(message);
      }

      return data;
    } catch (error) {
      console.error('UpdateProfile error:', error);
      throw error;
    }
  },

  getAccessToken,
  authHeaders,
  getAuthHeader,
  loadAuth,
  saveAuth,
};
