// app/context/WishlistContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define types
type WishlistItem = {
  id: string;
  image: string;
  price: string;
  originalPrice: string;
  description: string;
  size: string;
  brand: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Create provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Add item to wishlist
  const addToWishlist = (item: WishlistItem) => {
    // Check if item already exists in wishlist
    if (!isInWishlist(item.id)) {
      setWishlist(prevWishlist => [...prevWishlist, item]);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = (id: string) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== id));
  };

  // Check if item is in wishlist
  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Create custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};