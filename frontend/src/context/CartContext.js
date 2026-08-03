import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Khôi phục giỏ hàng từ localStorage khi reload
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  // Đồng bộ giỏ hàng vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = 'M', color = 'Đen') => {
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
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return; // Không cho giảm xuống dưới 1, không xoá sản phẩm
    setCartItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: quantity } : i))
    );
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty, 0
  );

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, updateQuantity, removeFromCart, clearCart,
      totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
