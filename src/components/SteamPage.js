import { useEffect, useState } from 'react';
import SteamTopbar from './SteamTopbar';
import SteamHero from './SteamHero';
import GameDetail from './GameDetail';
import AuthPages from './AuthPages';
import CartPage from './CartPage';
import Footer from './Footer';
import { authMethods } from '../Functional/Auth/authMethods';
import LibraryPage from './LibraryPage';
import WishListPage from './WishListPage';
import { createOrder, createOrderItem } from '../Functional/Order/OrderService';

// Return Auth data about registration\login of user.
const AUTH_USER_STORAGE_KEY = 'steam-frontend.authUser';
const CART_STORAGE_KEY = 'steam-frontend.cart';

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

//Main component for rendering all pages of the app. Contains some login.
export default function SteamPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [user, setUser] = useState(() => loadStoredUser());
  const [cartItems, setCartItems] = useState(() => loadStoredCart());
  const [wishListGames, setWishListGames] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [categories, setCategories] = useState([
    { title: 'Просмотр', items: [] },
    { title: 'Рекомендации', items: [] },
    { title: 'Категории', items: [] },
    { title: 'Способы игры', items: [] },
    { title: 'Особые разделы', items: [] },
  ]);
  const [hydrating, setHydrating] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  //Handle clicking on card.
  const handleGameClick = (game) => {
    setSelectedGame(game);
    setCurrentPage('game-detail');
  };

  //Handle back from game detail page.
  const handleBackFromGame = () => {
    setCurrentPage('home');
    setSelectedGame(null);
  };

  //Handleing click to profile account
  const handleAuthClick = () => {
    setCurrentPage('auth');
  };

  //Same but backward
  const handleBackFromAuth = () => {
    setCurrentPage('home');
  };

  //Going to this main page
  const handleHomeClick = () => {
    setCurrentPage('home');
    setSelectedGame(null);
  };


  //Goin to user's library page
  const handleLibraryClick = () => {
    setCurrentPage('library');
  };

  //Going to wishlist page
  const handleWishListClick = () => {
    setCurrentPage('wishlist');
  };

  const handleCartClick = () => {
    setCurrentPage('cart');
  };

  const handleAddToCart = (game) => {
    if (!game) return;
    const gameId = game?.id || game?.Id;
    if (!gameId) return;
    setCartItems((prev) => {
      if (prev.some((item) => (item?.id || item?.Id) === gameId)) return prev;
      return [...prev, { ...game, id: gameId }];
    });
  };

  const handleRemoveFromCart = (gameId) => {
    setCartItems((prev) => prev.filter((item) => (item?.id || item?.Id) !== gameId));
  };

  const handleCheckout = async () => {
    setCheckoutStatus('');
    if (!user) {
      setCheckoutStatus('Требуется войти, чтобы купить игры.');
      setCurrentPage('auth');
      return;
    }
    if (!cartItems.length) {
      setCheckoutStatus('Корзина пуста.');
      return;
    }

    setCheckoutProcessing(true);
    try {
      const userId = user?.id || user?.userId || user?.Id || user?.UserId || null;
      let orderId = null;
      if (userId) {
        orderId = await createOrder(userId);
      }

      const purchasedGames = Array.isArray(user?.PurchasedGames)
        ? [...user.PurchasedGames]
        : Array.isArray(user?.purchasedGames)
        ? [...user.purchasedGames]
        : [];
      const transactions = Array.isArray(user?.transactions)
        ? [...user.transactions]
        : Array.isArray(user?.Transactions)
        ? [...user.Transactions]
        : [];

      for (const gameItem of cartItems) {
        const itemId = gameItem?.id || gameItem?.Id;
        const priceValue = Number(gameItem?.price ?? gameItem?.Price ?? 0);

        if (orderId) {
          try {
            await createOrderItem(orderId, itemId, priceValue);
          } catch (orderItemError) {
            console.warn('Order item creation failed:', orderItemError);
          }
        }

        if (!purchasedGames.some((item) => (item?.id || item?.Id) === itemId)) {
          purchasedGames.push(gameItem);
        }

        transactions.push({
          description: `Куплено ${gameItem?.name || gameItem?.Name || 'игра'}`,
          amount: priceValue,
          game: gameItem,
        });
      }

      const nextUser = {
        ...(user || {}),
        PurchasedGames: purchasedGames,
        purchasedGames: purchasedGames,
        transactions,
        Transactions: transactions,
        accessToken: user?.accessToken || user?.AccessToken,
      };

      setUser(nextUser);
      authMethods.saveAuth(nextUser);
      setCartItems([]);
      setCheckoutStatus('Покупка завершена, игры добавлены в аккаунт.');
      setCurrentPage('library');
    } catch (error) {
      console.error('Checkout failed:', error);
      setCheckoutStatus(error?.message || 'Не удалось завершить покупку.');
    } finally {
      setCheckoutProcessing(false);
    }
  };

  const handleWishListUpdate = () => {
    const userId = user?.id || user?.userId || user?.Id || user?.UserId || null;
    if (!userId) return;

    let cancelled = false;
    (async () => {
      try {
        // const resp = await fetch(`https://localhost:7219/api/WishList/get-all`);
        const resp = await fetch(`https://26.185.217.20:7219/api/WishList/get-all`);
        const json = await resp.json().catch(() => null);
        if (resp.ok) {
          const data = Array.isArray(json) ? json : json?.data || json?.Data || [];
          const myList = data.find((l) => (l.userId || l.UserId) === userId) || null;
          const games = myList?.wishGames || myList?.WishGames || [];
          if (!cancelled) {
            setWishListGames(games);
          }
        }
      } catch (e) {
        console.warn('Failed to update wishlist:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  };

  const handleCategorySelect = (categoryTitle, selectedItem) => {
    console.log(`Selected from ${categoryTitle}:`, selectedItem);
    // Здесь можно добавить фильтрацию игр по выбранной категории
  };

  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, [user]);

  useEffect(() => {
    const userId = user?.id || user?.userId || user?.Id || user?.UserId || null;
    if (!userId) {
      setWishListGames([]);
      return;
    }
    handleWishListUpdate();
  }, [user?.id, user?.userId, user?.Id, user?.UserId]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  useEffect(() => {
    const token = user?.accessToken || user?.AccessToken;
    if (!token) return;

    let cancelled = false;
    (async () => {
      setHydrating(true);
      try {
        const profile = await authMethods.getCurrentUser();
        if (!cancelled && profile && typeof profile === 'object') {
          setUser((prev) => ({ ...(prev || {}), ...profile }));
        }
      } catch {
        // token might be invalid/expired; keep local user but UI will show error when trying profile actions
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="App">
      <SteamTopbar
        onAuthClick={handleAuthClick}
        onHomeClick={handleHomeClick}
        onLibraryClick={handleLibraryClick}
        onWishListClick={handleWishListClick}
        onCartClick={handleCartClick}
        cartCount={cartItems.length}
        user={user}
        activePage={currentPage}
        categories={categories}
        onCategorySelect={handleCategorySelect}
        selectedGenres={selectedGenres}
        onGenreSelect={setSelectedGenres}
      />
      {hydrating ? null : null}
      
      {currentPage === 'home' && (
        <div className="steam-shell">
          <main className="steam-main">
            <SteamHero onGameClick={handleGameClick} selectedGenres={selectedGenres} />
          </main>
        </div>
      )}

      {currentPage === 'game-detail' && (
        <div className="steam-shell">
          <GameDetail
            gameId={selectedGame?.id}
            game={selectedGame}
            onBack={handleBackFromGame}
            onGoToLibrary={handleLibraryClick}
            user={user}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            wishListGames={wishListGames}
            onWishListUpdate={handleWishListUpdate}
          />
        </div>
      )}

      {currentPage === 'auth' && (
        <div className="steam-shell">
          <div style={{ marginTop: '80px' }}>
            <AuthPages onBack={handleBackFromAuth} user={user} onUserChange={setUser} />
          </div>
        </div>
      )}

      {currentPage === 'library' && (
        <LibraryPage user={user} onBack={handleHomeClick} onGameClick={handleGameClick} />
      )}

      {currentPage === 'cart' && (
        <CartPage
          cartItems={cartItems}
          user={user}
          onBack={handleHomeClick}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
          checkoutStatus={checkoutStatus}
          checkoutProcessing={checkoutProcessing}
        />
      )}

      {currentPage === 'wishlist' && (
        <WishListPage user={user} onBack={handleHomeClick} onGameClick={handleGameClick} />
      )}

      <Footer />
    </div>
  );
}
