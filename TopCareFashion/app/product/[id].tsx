// app/product/[id].tsx - Remove Mix n Match button
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { mockProducts } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Use useEffect to handle any logic that depends on params
  useEffect(() => {
    console.log("Product ID from params:", params.id);
    setLoading(true);

    try {
      // Get the ID from params and provide fallback
      const productId = typeof params.id === 'string' ? params.id : '1';

      // Find the product in mockProducts
      const selectedProduct = mockProducts.find(p => p.id === productId);

      if (!selectedProduct) {
        console.warn(`Product with ID ${productId} not found, using first product`);
        setProduct(mockProducts[0]);
      } else {
        setProduct(selectedProduct);
      }

      // Set discount percentage - assuming standard product doesn't have original price
      // We'll use a default 0% discount or simulate a 15% discount
      setDiscountPercentage(15);
    } catch (error) {
      console.error("Error loading product:", error);
      setProduct(mockProducts[0]);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  // Generate product images (centralized products only have one image)
  const getProductImages = (imageUrl) => {
    // Create an array of 3 images using the same image
    return [imageUrl, imageUrl, imageUrl];
  };

  // Handle Add to Cart - Directly redirect to login page if not authenticated
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Directly redirect to Login page if user is not logged in
      router.push("/Login");
      return;
    }

    // User is authenticated, proceed with adding to cart
    if (product) {
      console.log("Adding product to cart:", product); // Debug log

      try {
        // Extract numeric price (handle both string and number formats)
        let productPrice = typeof product.price === 'number'
          ? product.price
          : parseFloat(String(product.price).replace(/[^\d.-]/g, ''));

        if (isNaN(productPrice)) {
          productPrice = 0; // Fallback if parsing fails
          console.log("Warning: Failed to parse product price, using 0 instead.");
        }

        // Calculate discounted price if applicable
        const discountedPrice = discountPercentage > 0
          ? productPrice * (1 - discountPercentage / 100)
          : undefined;

        console.log("Calculated prices:", {
          original: productPrice,
          discounted: discountedPrice,
          discountPercentage
        }); // Debug log

        // Create cart item with needed properties
        const cartItem = {
          id: product.id,
          name: product.name,
          price: productPrice,
          discountedPrice: discountedPrice,
          image: product.image,
          color: product.color,
          size: product.size,
          quantity: 1,
          discount: discountPercentage > 0 ? discountPercentage : undefined
        };

        console.log("Prepared cart item:", cartItem); // Debug log

        addToCart(cartItem);

        // Navigate to cart
        router.push("/Cart");
      } catch (error) {
        console.error("Error in handleAddToCart:", error);
        Alert.alert("Error", "Failed to add item to cart. Please try again.");
      }
    } else {
      console.log("Product is null or undefined");
    }
  };
  // Handle Add to Wishlist - Directly redirect to login page if not authenticated
  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      // Directly redirect to Login page if user is not logged in
      router.push("/Login");
      return;
    }

    // User is authenticated, proceed with wishlist action
    if (product) {
      // Check if product is already in wishlist
      if (isInWishlist(product.id)) {
        // Remove from wishlist if already there
        removeFromWishlist(product.id);
        Alert.alert("Removed from Wishlist", `${product.name} has been removed from your wishlist.`);
      } else {
        // Format price as string for wishlist display
        const formattedPrice = `S$${product.price.toFixed(2)}`;
        const formattedOriginalPrice = `S$${(product.price / (1 - discountPercentage / 100)).toFixed(2)}`;

        // Create wishlist item with needed properties
        const wishlistItem = {
          id: product.id,
          image: product.image,
          price: `S$${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}`,
          originalPrice: `S$${typeof product.price === 'number' ? (product.price / (1 - discountPercentage / 100)).toFixed(2) : 0}`,
          description: product.name,
          size: product.size,
          brand: product.brand || 'Brand Name'
        };

        // Add to wishlist
        addToWishlist(wishlistItem);
        Alert.alert("Added to Wishlist", `${product.name} has been added to your wishlist!`);
      }
    }
  };

  // Handle navigate to seller profile
  const handleSellerProfile = (sellerName) => {
    router.push(`/seller/${sellerName}`);
  };

  // If product is not loaded yet, show a simple loading state
  if (loading || !product) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Check if product is in wishlist
  const productInWishlist = isInWishlist(product.id);

  // Generate display price - adding $ prefix
  const displayPrice = `$${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}`;
  const originalPrice = `$${typeof product.price === 'number' ? (product.price / (1 - discountPercentage / 100)).toFixed(2) : 0}`;
  // Generated images array from single image
  const productImages = getProductImages(product.image);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity
          onPress={() => isAuthenticated ? router.push("/Wishlist") : router.push("/Login")}
          style={styles.favoriteButton}
        >
          <Ionicons name="heart-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Image Carousel */}
        <View style={styles.imageCarouselContainer}>
          <Image
            source={{ uri: productImages[currentImageIndex] }}
            style={styles.productImage}
            resizeMode="contain"
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          )}

          {/* Image Navigation Dots */}
          <View style={styles.imageDots}>
            {productImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
              >
                <View
                  style={[
                    styles.dot,
                    index === currentImageIndex ? styles.activeDot : {}
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image Thumbnails */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {productImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentImageIndex(index)}
            >
              <Image
                source={{ uri: image }}
                style={[
                  styles.thumbnail,
                  index === currentImageIndex ? styles.activeThumbnail : {}
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{displayPrice}</Text>
            <Text style={styles.originalPrice}>{originalPrice}</Text>
          </View>

          {/* Size and Condition displayed together */}
          <View style={styles.productMetaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Size:</Text>
              <Text style={styles.metaValue}>{product.size}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Condition:</Text>
              <Text style={styles.metaValue}>{product.condition}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Seller Info - Removed Mix n Match button */}
          <View style={styles.sellerContainer}>
            <Text style={styles.sellerTitle}>Seller</Text>
            <View style={styles.sellerInfoRow}>
              <TouchableOpacity onPress={() => handleSellerProfile(product.seller)}>
                <Text style={styles.sellerName}>{product.seller}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    4.8 · 24 sales {/* Mock data since mockProducts doesn't have this */}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Product Details */}
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>
            This {product.name} is in {product.condition} condition. Perfect for any occasion.
            Made with quality materials and excellent craftsmanship.
          </Text>

          {/* Only listing date shown - category, gender, and ID removed */}
          <View style={styles.listedDateContainer}>
            <Text style={styles.listedDateLabel}>Listed on</Text>
            <Text style={styles.listedDateValue}>{product.datePosted.toLocaleDateString()}</Text>
          </View>

          <View style={styles.noteContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#666" />
            <Text style={styles.noteText}>
              This is a pre-owned item. As a second-hand item, it is sold as-is in the condition and size stated above.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar with Add to Cart and Add to Wishlist buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.wishlistButton,
            productInWishlist && styles.wishlistButtonActive
          ]}
          onPress={handleAddToWishlist}
        >
          <Ionicons
            name={productInWishlist ? "heart" : "heart-outline"}
            size={20}
            color={productInWishlist ? "white" : "#0077b3"}
            style={styles.wishlistIcon}
          />
          <Text style={[
            styles.wishlistText,
            productInWishlist && styles.wishlistTextActive
          ]}>
            {productInWishlist ? "In Wishlist" : "Add to Wishlist"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={20} color="white" style={styles.cartIcon} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0077b3",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0077b3",
  },
  backButton: {
    padding: 5,
  },
  favoriteButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  imageCarouselContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "white",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imageDots: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#0077b3",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  thumbnailContainer: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeThumbnail: {
    borderColor: "#0077b3",
    borderWidth: 2,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 100, // Space for bottom bar
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0077b3",
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  productMetaContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaLabel: {
    fontSize: 15,
    color: "#666",
    marginRight: 5,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0077b3",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  sellerContainer: {
    marginBottom: 15,
  },
  sellerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  sellerInfoRow: {
    flexDirection: "row",
    alignItems: "center", // Changed from space-between to stretch
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0077b3",
    textDecorationLine: "underline",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    marginBottom: 15,
  },
  listedDateContainer: {
    marginBottom: 15,
  },
  listedDateLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 3,
  },
  listedDateValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  noteContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  noteText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  discountBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#ff3b30",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  // Bottom bar with two buttons
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wishlistButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#0077b3",
  },
  wishlistButtonActive: {
    backgroundColor: "#0077b3",
    borderColor: "#0077b3",
  },
  wishlistIcon: {
    marginRight: 8,
  },
  wishlistText: {
    color: "#0077b3",
    fontSize: 16,
    fontWeight: "bold",
  },
  wishlistTextActive: {
    color: "white",
  },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0077b3",
    paddingVertical: 15,
    borderRadius: 8,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});