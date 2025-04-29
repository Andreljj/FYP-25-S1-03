// app/context/CartContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

// Define the Cart Context type
type CartItem = {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  discount?: number;
  inStock?: boolean;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  getItemsCount: () => number;
  getTotalPrice: () => number;
};

// Create Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to parse price from various formats
const parsePrice = (price: any): number => {
  if (typeof price === 'number') return price;
  
  if (typeof price === 'string') {
    // Remove currency symbols and other non-numeric characters except decimal point
    const numericString = price.replace(/[^0-9.]/g, '');
    const parsedPrice = parseFloat(numericString);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
  }
  
  return 0; // Default if price is undefined or invalid
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add item to cart with console logging for debugging
  const addToCart = (item: any) => {
    console.log("Adding item to cart:", item); // Debug log
    
    try {
      // Normalize the price values
      const itemPrice = parsePrice(item.price);
      const itemDiscountedPrice = item.discountedPrice ? parsePrice(item.discountedPrice) : undefined;
      
      console.log("Normalized prices:", { 
        original: itemPrice, 
        discounted: itemDiscountedPrice 
      }); // Debug log
      
      // Create a normalized cart item
      const normalizedItem: CartItem = {
        id: item.id || `item-${Date.now()}`, // Ensure there's a valid ID
        name: item.name || item.description || 'Product', // Support different property names
        price: itemPrice,
        discountedPrice: itemDiscountedPrice,
        image: item.image || '',
        color: item.color,
        size: item.size,
        quantity: item.quantity || 1,
        discount: item.discount,
        inStock: item.inStock !== false // Default to true if not specified
      };
      
      console.log("Normalized item:", normalizedItem); // Debug log
      
      // Check if item already exists in cart
      const existingItem = cartItems.find(cartItem => cartItem.id === normalizedItem.id);
      
      if (existingItem) {
        // If it exists, increase quantity
        setCartItems(prevItems => prevItems.map(cartItem => 
          cartItem.id === normalizedItem.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        ));
        
        Alert.alert("Success", "Item quantity updated in cart!");
      } else {
        // If not, add new normalized item
        setCartItems(prevItems => [...prevItems, normalizedItem]);
        
        Alert.alert("Success", "Item added to cart!");
      }
      
      console.log("Updated cart:", [...cartItems, normalizedItem]); // Debug log
    } catch (error) {
      console.error("Error adding item to cart:", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Update item quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => prevItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Calculate total items in cart
  const getItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discountedPrice !== undefined ? item.discountedPrice : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity,
      getItemsCount,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};