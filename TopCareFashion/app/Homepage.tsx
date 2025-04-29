import React, { useState, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from './NavigationBar'; 
import { useAuth } from './context/AuthContext';
import { useRouter } from 'expo-router';
import PlatformStatistics from './PlatformStatistics';
import { mockProducts } from './data/mockData';

const HomepageScreen = () => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get recently added items from mockProducts
  const getRecentlyAddedItems = () => {
    // Make a copy of mockProducts to avoid modifying the original
    const products = [...mockProducts];
    
    // Check what date field is available (datePosted, dateAdded, createdAt, etc.)
    const firstProduct = products[0] || {};
    const dateField = Object.keys(firstProduct).find(key => 
      key.toLowerCase().includes('date') || key === 'createdAt' || key === 'timestamp'
    ) || 'datePosted';
    
    console.log("Using date field for sorting:", dateField);
    
    // Sort products by date in descending order (newest first)
    const sortedProducts = products.sort((a, b) => {
      // Safely create date objects with fallbacks
      let dateA, dateB;
      
      try {
        dateA = a[dateField] ? new Date(a[dateField]) : new Date(0);
        dateB = b[dateField] ? new Date(b[dateField]) : new Date(0);
        
        // Handle invalid dates
        if (isNaN(dateA.getTime())) dateA = new Date(0);
        if (isNaN(dateB.getTime())) dateB = new Date(0);
      } catch (e) {
        console.error("Error parsing dates:", e);
        return 0; // Keep original order on error
      }
      
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
    
    console.log("First 2 products after sorting:", 
      sortedProducts.slice(0, 2).map(p => ({
        name: p.name, 
        date: p[dateField]
      }))
    );
    
    // Take the top 5 most recent products
    return sortedProducts.slice(0, 5).map(product => ({
      id: product.id,
      name: product.name,
      image: product.image,
      price: typeof product.price === 'number' ? product.price.toFixed(2) : product.price,
      size: product.size,
      condition: product.condition,
      seller: product.seller,
      // Add isNew flag to products posted within the last 3 days
      isNew: (() => {
        try {
          const productDate = new Date(product[dateField]);
          if (isNaN(productDate.getTime())) return false;
          return (new Date() - productDate) / (1000 * 60 * 60 * 24) < 3;
        } catch (e) {
          return false;
        }
      })()
    }));
  };
  
  // Get deals items (products with discounts)
  const getDealsItems = () => {
    // Filter products where we can simulate a discount (e.g., based on condition)
    // For demo purposes, let's just take some products and add discount info
    return mockProducts.slice(0, 5).map(product => {
      // Calculate a random discount between 20-50%
      const discountPercentage = Math.floor(Math.random() * 31) + 20;
      const originalPrice = product.price;
      const discountedPrice = (originalPrice * (100 - discountPercentage) / 100).toFixed(2);
      
      return {
        id: product.id,
        name: product.name,
        image: product.image,
        originalPrice: typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice,
        discountedPrice,
        discountPercentage: `-${discountPercentage}%`,
        condition: product.condition,
        seller: product.seller
      };
    });
  };
  
  // Get recently added items and deals items
  const recentItems = getRecentlyAddedItems();
  const dealsItems = getDealsItems();
  
  // Product listing handler
  const handleAddProduct = () => {
    router.push('/ProductListing');
  };
  
  // Product selection handler
  const handleProductSelect = (item) => {
    // Navigate to product details page
    router.push({
      pathname: `/product/${item.id}`,
      params: { productId: item.id }
    });
  };
  
  // Refresh data
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate API call to refresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  
  // Load more items
  const loadMoreItems = () => {
    if (loading) return;
    
    setLoading(true);
    // Simulate API call to load more items
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeContainer}>
        <NavigationBar activeTab="TOP" showAddButton={true} />
        
        <View style={styles.mainContainer}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#0077b3']}
                tintColor="#0077b3"
              />
            }
            onScroll={({ nativeEvent }) => {
              const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
                const paddingToBottom = 20;
                return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
              };
              
              if (isCloseToBottom(nativeEvent)) {
                loadMoreItems();
              }
            }}
            scrollEventThrottle={400}
          >
            {/* Welcome Banner for logged in users */}
            <View style={styles.welcomeBanner}>
              <Text style={styles.welcomeTitle}>Welcome back, {user?.name || user?.username || 'there'}!</Text>
              <Text style={styles.welcomeSubtitle}>Discover pre-loved fashion just for you</Text>
            </View>
            
            {/* Recently Added Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Added</Text>
              <TouchableOpacity onPress={() => router.push('/Tops')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              horizontal
              data={recentItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.productCard}
                  onPress={() => handleProductSelect(item)}
                  activeOpacity={0.7}
                >
                  {item.isNew && (
                    <View style={styles.justAddedBadge}>
                      <Text style={styles.justAddedText}>Just Added</Text>
                    </View>
                  )}
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <View style={styles.productContent}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.productPrice}>${item.price}</Text>
                    <View style={styles.productMeta}>
                      <View style={[styles.conditionBadge, 
                        item.condition === "Like New" ? styles.likeNewBadge : 
                        item.condition === "Good" ? styles.goodBadge : 
                        item.condition === "Fair" ? styles.fairBadge : styles.excellentBadge
                      ]}>
                        <Text style={styles.conditionText}>{item.condition}</Text>
                      </View>
                      <Text style={styles.sizeText}>{item.size}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />

            {/* Trending Deals Section */}
            <View style={styles.dealsBanner}>
              <Text style={styles.dealsTitle}>Trending Deals</Text>
              <Text style={styles.dealsSubtitle}>Quality pieces at amazing prices</Text>
            </View>
            
            <FlatList
              horizontal
              data={dealsItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.dealCard} 
                  onPress={() => handleProductSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.dealImage} />
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{item.discountPercentage}</Text>
                    </View>
                  </View>
                  <View style={styles.dealDetails}>
                    <Text style={styles.dealName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.originalPrice}>${item.originalPrice}</Text>
                      <Text style={styles.discountedPrice}>${item.discountedPrice}</Text>
                    </View>
                    <View style={styles.dealMeta}>
                      <Text style={styles.conditionText}>{item.condition}</Text>
                      <Text style={styles.sellerText}>@{item.seller}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />
            
            {/* Platform Statistics Section */}
            <PlatformStatistics />
            
            {/* Sustainable Fashion Callout */}
            <View style={styles.sustainableBanner}>
              <Text style={styles.sustainableTitle}>Shop Sustainably</Text>
              <Text style={styles.sustainableText}>
                Each pre-loved item you buy helps reduce fashion waste and extends the lifecycle of quality clothing.
              </Text>
              <TouchableOpacity 
                style={styles.learnMoreButton}
                onPress={() => router.push('/aboutUs')}
              >
                <Text style={styles.learnMoreText}>Learn More</Text>
              </TouchableOpacity>
            </View>
            
            {/* Extra padding at bottom for the button */}
            <View style={{ height: 100 }} />
          </ScrollView>
          
          {/* Loading indicator at bottom when loading more */}
          {loading && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#0077b3" />
              <Text style={styles.loadingMoreText}>Loading more...</Text>
            </View>
          )}
          
          {/* Floating action button at bottom middle */}
          {isAuthenticated && (
            <View style={styles.floatingButtonContainer}>
              <TouchableOpacity 
                style={styles.floatingButton}
                onPress={handleAddProduct}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={32} color="white" />
              </TouchableOpacity>
              <Text style={styles.buttonLabel}>List</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: "#0077b3" 
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f8f8f8" 
  },
  
  // Welcome banner
  welcomeBanner: {
    backgroundColor: "#0077b3",
    padding: 20,
    paddingBottom: 25,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  
  // Section headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333",
  },
  viewAllText: {
    color: "#0077b3",
    fontWeight: "500",
    fontSize: 14,
  },
  horizontalListContent: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  
  // Product cards
  productCard: { 
    width: 160,
    marginHorizontal: 7,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
    position: "relative",
  },
  productImage: { 
    width: "100%", 
    height: 160, 
    resizeMode: "cover",
  },
  productContent: {
    padding: 10,
  },
  productName: { 
    fontSize: 14, 
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
    minHeight: 35,
  },
  productPrice: { 
    fontSize: 16,
    fontWeight: "bold",
    color: "#0077b3",
    marginBottom: 5,
  },
  productMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  likeNewBadge: { backgroundColor: "#4CAF50" },
  excellentBadge: { backgroundColor: "#8BC34A" },
  goodBadge: { backgroundColor: "#FFC107" },
  fairBadge: { backgroundColor: "#FF9800" },
  conditionText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  sizeText: {
    fontSize: 12,
    color: "#666",
  },
  justAddedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF3D00",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 1,
  },
  justAddedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  
  // Deals section
  dealsBanner: {
    backgroundColor: "#3F51B5",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 10,
  },
  dealsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  dealsSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  dealCard: {
    width: 160,
    marginHorizontal: 7,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  dealImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#3F51B5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  dealDetails: {
    padding: 10,
  },
  dealName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
    minHeight: 35,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 5,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3F51B5",
  },
  dealMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerText: {
    fontSize: 11,
    color: "#666",
    fontStyle: "italic",
  },
  
  // Sustainable banner
  sustainableBanner: {
    margin: 15,
    padding: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  sustainableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  sustainableText: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
    marginBottom: 15,
  },
  learnMoreButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  learnMoreText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  
  // Loading indicator
  loadingMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  loadingMoreText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  
  // Floating action button
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0077b3",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonLabel: {
    color: "#0077b3",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomepageScreen;