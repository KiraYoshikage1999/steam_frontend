// Auth API methods
// TODO: Connect to backend API endpoints

export const authMethods = {
  // Register a new user
  async register(username, email, password) {
    try {
      const request = await fetch('https://localhost:7219/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      // return await response.json();
      console.log('Register method called:', { username, email, password });
    } catch (error) {
      console.error('Register error:', error);
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
