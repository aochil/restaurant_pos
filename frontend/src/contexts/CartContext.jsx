import React, { createContext, useState, useEffect } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: '0.00',
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // persist cart
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = menu_item => {
    setCart(prev => {
      const idx = prev.findIndex(ci => ci.menu_item.id === menu_item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { menu_item, quantity: 1 }];
    });
  };

  const removeItem = menu_item_id => {
    setCart(prev =>
      prev
        .map(ci =>
          ci.menu_item.id === menu_item_id
            ? { ...ci, quantity: ci.quantity - 1 }
            : ci
        )
        .filter(ci => ci.quantity > 0)
    );
  };
  // Remove an item entirely, regardless of quantity
  const removeAllItem = menu_item_id => {
    setCart(prev => prev.filter(ci => ci.menu_item.id !== menu_item_id));
  };

  // Set a specific quantity (>=1) or remove if 0
  const updateItem = (menu_item_id, quantity) => {
    if (quantity <= 0) {
      removeAllItem(menu_item_id);
    } else {
      setCart(prev =>
        prev.map(ci =>
          ci.menu_item.id === menu_item_id
            ? { ...ci, quantity }
            : ci
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalPrice = cart
    .reduce((sum, ci) => sum + ci.menu_item.price * ci.quantity, 0)
    .toFixed(2);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, removeAllItem, updateItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
