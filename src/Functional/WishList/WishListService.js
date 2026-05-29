import log from '../../utils/Logger';
import { authMethods } from '../Auth/authMethods';

//const API_BASE = 'https://localhost:7219';
const API_BASE = 'https://26.185.217.20:7219';

function getAuthHeader() {
  log.debug('Getting Auth Header token for WishList');
  const token = authMethods.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function addToWishList(userId, gameId) {
  try {
    log.debug('Adding game to wishlist:', gameId);
    const response = await fetch(`${API_BASE}/api/WishList/add-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ userId, gameId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

export async function removeFromWishList(userId, gameId) {
  try {
    log.debug('Removing game from wishlist:', gameId);
    const response = await fetch(`${API_BASE}/api/WishList/remove-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ userId, gameId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}

export async function getWishList(userId) {
  try {
    log.debug('Getting wishlist for user:', userId);
    const response = await fetch(`${API_BASE}/api/WishList/get-by-user?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return data;
  } catch (error) {
    console.error('Error getting wishlist:', error);
    throw error;
  }
}
