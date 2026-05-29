import log from '../../utils/Logger';
import { authMethods } from '../Auth/authMethods';

const API_BASE = 'https://localhost:7219';
//const API_BASE = 'https://26.185.217.20:7219';

function getAuthHeader() {
  log.debug('Getting Auth Header token for WishList');
  const token = authMethods.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || data?.Message || data?.ErrorMessage || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }
  return data?.data ?? data ?? null;
}

export async function getWishList(userId) {
  try {
    log.debug('Getting wishlist for user:', userId);
    const response = await fetch(`${API_BASE}/api/Wishlist/get-by-user?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getAuthHeader(),
      },
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    throw error;
  }
}

async function createWishList(userId, game) {
  const payload = {
    id: crypto?.randomUUID ? crypto.randomUUID() : '00000000-0000-0000-0000-000000000000',
    userId,
    wishGames: [game],
  };

  const response = await fetch(`${API_BASE}/api/Wishlist/create-wishlist`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return await parseResponse(response);
}

async function updateWishList(wishListId, userId, games) {
  const payload = {
    id: wishListId,
    userId,
    wishGames: Array.isArray(games) ? games : [],
  };

  const response = await fetch(`${API_BASE}/api/Wishlist/update-wishlist`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return await parseResponse(response);
}

export async function addToWishList(userId, game) {
  if (!userId) {
    throw new Error('User ID is required to update the wishlist.');
  }
  if (!game || typeof game !== 'object') {
    throw new Error('Game object is required to add to wishlist.');
  }

  try {
    log.debug('Adding game to wishlist for user:', userId);
    const existing = await getWishList(userId);
    if (!existing) {
      return await createWishList(userId, game);
    }

    const existingGames = Array.isArray(existing.wishGames)
      ? existing.wishGames
      : Array.isArray(existing.WishGames)
      ? existing.WishGames
      : [];

    const normalizedGameId = game?.id || game?.Id;
    const alreadyPresent = existingGames.some((item) => (item?.id || item?.Id) === normalizedGameId);
    if (alreadyPresent) {
      return existing;
    }

    return await updateWishList(existing.id || existing.Id, userId, [...existingGames, game]);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

export async function removeFromWishList(userId, gameId) {
  if (!userId) {
    throw new Error('User ID is required to update the wishlist.');
  }
  if (!gameId) {
    throw new Error('Game ID is required to remove from wishlist.');
  }

  try {
    log.debug('Removing game from wishlist for user:', userId);
    const existing = await getWishList(userId);
    if (!existing) {
      return null;
    }

    const existingGames = Array.isArray(existing.wishGames)
      ? existing.wishGames
      : Array.isArray(existing.WishGames)
      ? existing.WishGames
      : [];

    const updatedGames = existingGames.filter((item) => (item?.id || item?.Id) !== gameId);
    return await updateWishList(existing.id || existing.Id, userId, updatedGames);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}
