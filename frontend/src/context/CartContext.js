import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Tự động load/reset giỏ hàng theo User ID
  useEffect(() => {
    // Dọn dẹp key cũ không gán user
    localStorage.removeItem('cart');

    if (user && user.id) {
      try {
        const userCart = localStorage.getItem(`cart_user_${user.id}`);
        setCartItems(userCart ? JSON.parse(userCart) : []);
      } catch {
        setCartItems([]);
      }
    } else {
      // Khi chưa đăng nhập hoặc đã đăng xuất -> Giỏ hàng trống
      setCartItems([]);
    }
  }, [user]);

  // Đồng bộ giỏ hàng theo User ID vào localStorage
  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(`cart_user_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product, quantity = 1, size = 'M', color = 'Đen') => {
    if (!user) return false;
    setCartItems((prev) => {
      const key = `${product.id}-${size}-${color}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + quantity } : i
        );
      }
      return [...prev, {
        key,
        id: product.id,
        name: product.name,
        image: product.images?.[0]?.image_url,
        price: product.price,
        qty: quantity,
        size,
        color
      }];
    });
    return true;
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: quantity } : i))
    );
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key));
  };

  const clearCart = () => {
    setCartItems([]);
    if (user && user.id) {
      localStorage.removeItem(`cart_user_${user.id}`);
    }
  };

  const totalItems = user ? cartItems.reduce((sum, i) => sum + i.qty, 0) : 0;
  const totalPrice = user ? cartItems.reduce((sum, i) => sum + i.price * i.qty, 0) : 0;

  return (
    <CartContext.Provider value={{
      cartItems: user ? cartItems : [],
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
