import log from '../../utils/Logger';
import { authMethods } from '../Auth/authMethods';

const API_BASE = 'https://localhost:7219';

function getAuthHeader() {
  log.debug('Getting Auth Header token');
  const token = authMethods.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createOrder(userId) {
  log.debug("Creating Order");
  try {
    const response = await fetch(`${API_BASE}/api/Order/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.orderId || data?.id || data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function createOrderItem(orderId, gameId, price) {
  try {
    const response = await fetch(`${API_BASE}/api/OrderItem/create-order-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ orderId, gameId, price }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order item:', error);
    throw error;
  }
}

function getStoredOrderedGameIds() {
  return JSON.parse(localStorage.getItem('steam-frontend.orderedGameIds') || '[]');
}

export function hasOrderedGame(gameId) {
  return getStoredOrderedGameIds().includes(gameId);
}

export function markGameOrdered(gameId) {
  const ids = getStoredOrderedGameIds();
  if (!ids.includes(gameId)) {
    ids.push(gameId);
    localStorage.setItem('steam-frontend.orderedGameIds', JSON.stringify(ids));
  }
}
