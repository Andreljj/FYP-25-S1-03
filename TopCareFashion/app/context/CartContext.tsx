// app/context/CartContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 1. Define Cart Item type
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  inStock?: boolean;
};

// 2. Define Context type
type CartContextType = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: any) => Promise<void>;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  getItemsCount: () => number;
  getTotalPrice: () => number;
  refreshCart: (token: string) => Promise<void>;
};

// 3. Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Helper to normalize price
const parsePrice = (price: any): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const numericString = price.replace(/[^0-9.]/g, '');
    const parsedPrice = parseFloat(numericString);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
  }
  return 0;
};

// 5. Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem('cartItems');
        if (saved) setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart from storage', e);
      }
    };
    loadCart();
  }, []);

  // Save to AsyncStorage on change
  useEffect(() => {
    AsyncStorage.setItem('cartItems', JSON.stringify(cartItems)).catch(e =>
      console.error('Failed to save cart', e)
    );
  }, [cartItems]);

  const addToCart = async (item: any): Promise<void> => {
    try {
      const itemPrice = parsePrice(item.price);
      const normalizedItem: CartItem = {
        id: (item.listing && item.listing._id) || item._id || item.id,
        name: (item.listing && item.listing.title) || item.name || item.title || 'Product',
        price: parsePrice((item.listing && item.listing.price) || item.price),
        image: (item.listing && item.listing.image) || item.image || '',
        color: (item.listing && item.listing.color) || item.color,
        size: (item.listing && item.listing.size) || item.size,
        quantity: item.quantity || 1,
        inStock: item.listing ? item.listing.inStock !== false : item.inStock !== false,
      };
      const existingIdx = cartItems.findIndex(
        (cartItem) => cartItem.id === normalizedItem.id
      );
      let updatedCart;
      if (existingIdx >= 0) {
        updatedCart = [...cartItems];
        updatedCart[existingIdx] = {
          ...updatedCart[existingIdx],
          quantity: updatedCart[existingIdx].quantity + 1,
        };
        Alert.alert('Success', 'Item quantity updated in cart!');
      } else {
        updatedCart = [...cartItems, normalizedItem];
        Alert.alert('Success', 'Item added to cart!');
      }
      setCartItems(updatedCart);
      try {
  const token = await AsyncStorage.getItem('token');
  if (token && normalizedItem.id) {
    await axios.post("https://topcare-fashion-backend.onrender.com/api/cart/add", {
      listingId: normalizedItem.id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await refreshCart(token); // optional but keeps cart synced
  }
} catch (e) {
  console.error("Backend cart update failed", e);
}
      return Promise.resolve();
    } catch (e) {
      console.error('Error adding item to cart', e);
      Alert.alert('Error', 'Failed to add item to cart.');
      return Promise.reject(e);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User not authenticated!');
        return;
      }
      // Call the backend API to remove the item
      await axios.delete(
        `https://topcare-fashion-backend.onrender.com/api/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh the cart from backend
      await refreshCart(token);
      Alert.alert('Success', 'Item removed from cart!');
    } catch (e) {
      console.error('Error removing item from cart:', e);
      Alert.alert('Error', 'Failed to remove item from cart.');
    }
  };

  const clearCart = () => setCartItems([]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updated = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
  };

  const getItemsCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // 6. Sync with backend
  const refreshCart = async (token: string) => {
    try {
      const res = await fetch('https://topcare-fashion-backend.onrender.com/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Map backend items to CartItem type -- adjust as needed!
      const normalized: CartItem[] = (data.items || []).map((item) => ({
        id: item.listing?._id || item._id || item.id,
        name: item.listing?.title || item.name || item.title || 'Product',
        price: parsePrice(item.listing?.price),
        image: item.listing?.image || item.image || '', // <-- FIX THIS LINE
        color: item.color,
        size: item.size,
        quantity: item.quantity || 1,
        inStock: item.inStock !== false,
      }));
      setCartItems(normalized);
      await AsyncStorage.setItem('cartItems', JSON.stringify(normalized));
    } catch (e) {
      console.error('Error refreshing cart from backend', e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getItemsCount,
        getTotalPrice,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 7. Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};