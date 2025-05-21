// app/product/[id].tsx
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



const { width } = Dimensions.get("window");

const getDaysAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    const productId = typeof params.id === 'string' ? params.id : '';
    if (!productId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`https://topcare-fashion-backend.onrender.com/api/listings/${productId}`);
      setProduct(res.data);
      // If your backend returns a discount or similar, setDiscountPercentage here
      setDiscountPercentage(res.data.discount || 0);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert(
        'Error',
        'Could not fetch product details. Please try again later.'
      );
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, [params.id])
  );
  


  // Generate product images (centralized products only have one image)
  const getProductImages = (imageUrl) => {
    // Create an array of 3 images using the same image
    return [imageUrl, imageUrl, imageUrl];
  };


  const handleEdit = () => {
    if (!product) return;
    router.push({
      pathname: '/UpdateListing',
      params: { id: product._id }
    });
  };
  // Handle navigate to seller profile
  const handleSellerProfile = () => {
    if (product && product.user && product.user._id) {
      router.push({
        pathname: '/SellerPage',
        params: { sellerId: product.user._id }
      });
    }
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
        <View style={{ width: 28 }} /> {/* Empty view for spacing */}
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
          <Text style={styles.productName}>{product.title}</Text>

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

          {/* Seller Info */}
          <View style={styles.sellerContainer}>
            <Text style={styles.sellerTitle}>Seller</Text>
            <View style={styles.sellerInfoRow}>
              <TouchableOpacity 
                style={styles.sellerInfo} 
                onPress={handleSellerProfile}
              >
                <Text style={styles.sellerName}>{product.user?.username || 'Anonymous'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Product Details */}
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>
            This {product.title} is in {product.condition} condition. {product.description}
          </Text>

          {/* Only listing date shown - category, gender, and ID removed */}
          <View style={styles.listedDateContainer}>
            <Text style={styles.listedDateLabel}>Listed {getDaysAgo(product.createdAt)}</Text>
          </View>

          <View style={styles.noteContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#666" />
            <Text style={styles.noteText}>
              This is a pre-owned item. As a second-hand item, it is sold as-is in the condition and size stated above.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar with Edit button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color="#0077b3"
            style={styles.editIcon}
          />
          <Text style={styles.editText}>Edit Listing</Text>
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
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0077b3",
  },
  editIcon: {
    marginRight: 8,
  },
  editText: {
    color: "#0077b3",
    fontSize: 16,
    fontWeight: "bold",
  }
});