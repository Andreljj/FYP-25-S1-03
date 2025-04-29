// app/Wishlist.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWishlist } from './context/WishlistContext';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function WishlistScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [showMixMatchTooltip, setShowMixMatchTooltip] = useState(false);
  
  // Use contexts
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Handle Mix n Match
  const handleMixAndMatch = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/Login');
      return;
    }

    if (wishlist.length === 0) {
      Alert.alert(
        "Empty Wishlist",
        "Add items to your wishlist to use Mix n Match feature",
        [{ text: "OK" }]
      );
      return;
    }

    // Navigate to Mix n Match screen with wishlist items
    Alert.alert("Mix n Match", "Opening Mix n Match tool for your wishlist items");
    // Implement the actual navigation when Mix n Match page is ready
    // router.push('/MixAndMatch');
  };

  // Calculate discount percentage
  const getDiscountPercentage = (price, originalPrice) => {
    try {
      // Handle cases where price might be a string like "S$10.99"
      const current = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
      const original = typeof originalPrice === 'string' ? parseFloat(originalPrice.replace(/[^\d.-]/g, '')) : originalPrice;

      if (isNaN(current) || isNaN(original) || original === 0) {
        return 0; // Return 0% discount if any value is invalid
      }

      return Math.round(((original - current) / original) * 100);
    } catch (error) {
      console.error("Error calculating discount:", error);
      return 0;
    }
  };

  // Calculate number of columns based on screen width
  const getNumColumns = () => {
    if (isWeb) {
      if (width > 1200) return 4;
      if (width > 900) return 3;
      if (width > 600) return 2;
    }
    return 2; // Default for mobile and narrow web screens
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleAddToCart = (item) => {
    console.log("Adding wishlist item to cart:", item); // Debug log

    try {
      // Parse prices from strings to numbers
      let itemPrice = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^\d.-]/g, ''))
        : item.price;

      if (isNaN(itemPrice)) {
        itemPrice = 0;
        console.log("Warning: Failed to parse item price, using 0 instead.");
      }

      // Calculate discount from percentage if available
      const discount = getDiscountPercentage(item.price, item.originalPrice);

      // Create properly formatted cart item
      const cartItem = {
        id: item.id,
        name: item.description || "Product", // Use description as name
        price: itemPrice,
        discountedPrice: discount > 0 ? itemPrice : undefined, // If there's a discount, current price is already discounted
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: 1,
        discount: discount > 0 ? discount : undefined
      };

      console.log("Prepared cart item:", cartItem); // Debug log

      // Add to cart and navigate
      addToCart(cartItem);
      router.push("/Cart");
    } catch (error) {
      console.error("Error in handleAddToCart:", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  const navigateToProductDetails = (id) => {
    router.push(`/product/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  // Calculate the width of each item based on the number of columns
  const numColumns = getNumColumns();
  const itemWidth = (width - (40 + (numColumns * 16))) / numColumns;

  // Render item with an explicit width based on numColumns
  const renderItem = ({ item }) => {
    const discountPercentage = getDiscountPercentage(item.price, item.originalPrice);

    return (
      <View style={[styles.itemContainer, { width: itemWidth }]}>
        {/* Product Image with TouchableOpacity */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => navigateToProductDetails(item.id)}
          activeOpacity={0.8}
        >
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          )}

          {imageErrors[item.id] ? (
            <View style={[styles.itemImage, styles.errorImageContainer]}>
              <Ionicons name="image-outline" size={40} color="#ccc" />
              <Text style={styles.errorImageText}>Image not available</Text>
            </View>
          ) : (
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
              onError={() => handleImageError(item.id)}
            />
          )}
        </TouchableOpacity>

        {/* Heart Icon Button */}
        <TouchableOpacity
          onPress={() => removeFromWishlist(item.id)}
          style={styles.heartIcon}
        >
          <Ionicons name="heart" size={22} color="#ff3b30" />
        </TouchableOpacity>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.brandName}>{item.brand}</Text>
          <Text
            style={styles.itemDescription}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>

          <Text style={styles.sizeText}>Size: {item.size}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="cart-outline" size={18} color="white" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.customHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={styles.rightHeaderPlaceholder} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0077b3" />
          <Text style={styles.loadingText}>Loading your wishlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />

      {/* Custom Header with Back Button, Item Count, and Mix n Match Button */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Wishlist</Text>
          {wishlist.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{wishlist.length}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.mixMatchButton}
          onPress={handleMixAndMatch}
          onMouseEnter={() => setShowMixMatchTooltip(true)}
          onMouseLeave={() => setShowMixMatchTooltip(false)}
          onPressIn={() => setShowMixMatchTooltip(true)}
          onPressOut={() => setTimeout(() => setShowMixMatchTooltip(false), 1500)}
        >
          <Ionicons name="color-wand-outline" size={24} color="white" />
          {showMixMatchTooltip && (
            <View style={styles.mixMatchTooltip}>
              <Text style={styles.mixMatchTooltipText}>Mix n Match</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {wishlist.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubText}>Items you save to your wishlist will appear here</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/Homepage")}
            >
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={wishlist}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            key={numColumns} // This forces the FlatList to re-render when numColumns changes
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0077b3",
  },
  customHeader: {
    backgroundColor: "#0077b3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    minWidth: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mixMatchButton: {
    padding: 8,
    position: 'relative',
  },
  mixMatchTooltip: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    zIndex: 999,
    minWidth: 100,
  },
  mixMatchTooltipText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  rightHeaderPlaceholder: {
    width: 40, // To balance the header
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 0.85,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  errorImageContainer: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorImageText: {
    marginTop: 10,
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    zIndex: 1,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 0,
    backgroundColor: "#ff3b30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    zIndex: 1,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
  },
  productInfo: {
    padding: 12,
  },
  brandName: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    height: 40, // Fixed height for 2 lines
  },
  sizeText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0077b3",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    backgroundColor: "#0077b3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  browseButton: {
    backgroundColor: "#0077b3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});