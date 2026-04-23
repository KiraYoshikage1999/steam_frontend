// Auth API methods
// TODO: Connect to backend API endpoints

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

      const response = await fetch('https://localhost:7219/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await response.text().catch(() => '');
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text || null;
      }

      if (!response.ok) {
        const message =
          (data && (data.message || data.title || data.error || data.errors)) ||
          (typeof data === 'string' ? data : null) ||
          `Register failed (${response.status})`;

        console.error('Register failed:', response.status, data);
        throw new Error(
          typeof message === 'string' ? message : `Register failed (${response.status})`
        );
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
      // const response = await fetch('https://localhost:7219/api/Auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // return await response.json();
      console.log('Login method called:', { email, password });
    } catch (error) {
      console.error('Login error:', error);
    }
  },

  // Logout user
  async logout() {
    try {
      // const response = await fetch('https://localhost:7219/api/Auth/logout', {
      //   method: 'POST',
      // });
      // return await response.json();
      console.log('Logout method called');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      // const response = await fetch('https://localhost:7219/api/Auth/me');
      // return await response.json();
      console.log('GetCurrentUser method called');
    } catch (error) {
      console.error('GetCurrentUser error:', error);
    }
  },
};
