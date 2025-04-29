// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}