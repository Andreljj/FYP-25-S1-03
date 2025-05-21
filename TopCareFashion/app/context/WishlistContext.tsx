// app/context/WishlistContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // adjust path if needed
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



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
  const { token } = useAuth();
  const fetchWishlistFromBackend = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await axios.get("https://topcare-fashion-backend.onrender.com/api/wishlist/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const formattedWishlist = (res.data.listings || []).map((item) => ({
      id: item._id,
      image: item.image,
      price: `S$${parseFloat(item.price).toFixed(2)}`,
      originalPrice: `S$${(
        parseFloat(item.price) /
        (1 - (item.discount || 0) / 100)
      ).toFixed(2)}`,
      description: item.title,
      size: item.size,
      brand: item.brand || "Brand",
    }));

    setWishlist(formattedWishlist);
  } catch (error) {
    console.error("Failed to fetch wishlist from backend:", error);
  }
};
useEffect(() => {
  if (token) {
    fetchWishlistFromBackend();
  } else {
    setWishlist([]); // Clear wishlist when user logs out
  }
}, [token]);


  // Add item to wishlist
  const addToWishlist = async (item: WishlistItem) => {
  if (!isInWishlist(item.id)) {
    try {
      await axios.post(`https://topcare-fashion-backend.onrender.com/api/wishlist/add/${item.id}`, {}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      setWishlist(prevWishlist => [...prevWishlist, item]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  }
};


  // Remove item from wishlist
  const removeFromWishlist = async (id: string) => {
  try {
    await axios.delete(`https://topcare-fashion-backend.onrender.com/api/wishlist/remove/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== id));
  } catch (error) {
    console.error("Error removing from wishlist:", error);
  }
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