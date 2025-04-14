// app/index.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from './NavigationBar'; 
import { useAuth } from './context/AuthContext';
import { useRouter } from 'expo-router';
import PlatformStatistics from './PlatformStatistics';
import TopRatedSellers from './TopRatedSellers';
import { recentItems, dealsItems, testimonials, reviews } from './data/mockData';

const { width } = Dimensions.get('window');

// Testimonials Component (updated)
const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  
  // Auto slide effect - now it also scrolls the ScrollView when activeIndex changes
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      setActiveIndex(nextIndex);
      
      // Scroll to the new index
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * (width - 30),
          animated: true
        });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeIndex, testimonials.length]);
  
  // Handle manual scroll
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );
  
  // Handle scroll end for updating active index
  const handleScrollEnd = (event) => {
    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round(position / (width - 30));
    setActiveIndex(index);
  };
  
  // Scroll to selected index when user taps on a pagination dot
  const handleDotPress = (index) => {
    setActiveIndex(index);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (width - 30),
        animated: true
      });
    }
  };
  
  // Render stars based on rating
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color={star <= rating ? "#FFD700" : "#ccc"}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };
  
  return (
    <View style={styles.testimonialsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What Our Users Say</Text>
      </View>
      
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {testimonials.map((testimonial) => (
          <View key={testimonial.id} style={[styles.testimonialCard, { width: width - 30 }]}>
            <View style={styles.testimonialHeader}>
              <Image source={{ uri: testimonial.avatar }} style={styles.testimonialAvatar} />
              <View style={styles.testimonialUserInfo}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialLocation}>{testimonial.location}</Text>
              </View>
              {renderStars(testimonial.rating)}
            </View>
            <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
          </View>
        ))}
      </Animated.ScrollView>
      
      <View style={styles.paginationContainer}>
        {testimonials.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDotPress(index)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// User Reviews Component
const UserReviews = () => {
  const router = useRouter();
  
  // Render stars based on rating
  const renderStars = (rating) => {
    return (
      <View style={styles.reviewStarsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={14}
            color={star <= rating ? "#FFD700" : "#ccc"}
            style={styles.reviewStarIcon}
          />
        ))}
      </View>
    );
  };
  
  const handleReviewPress = (productId) => {
    router.push({
      pathname: `/product/${productId}`,
      params: { productId }
    });
  };
  
  const handleViewAllReviews = () => {
    router.push('/reviews');
  };
  
  return (
    <View style={styles.reviewsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        <TouchableOpacity onPress={handleViewAllReviews}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {reviews.map((review) => (
        <TouchableOpacity 
          key={review.id}
          style={styles.reviewCard}
          onPress={() => handleReviewPress(review.productId)}
          activeOpacity={0.8}
        >
          <View style={styles.reviewHeader}>
            <View style={styles.reviewUser}>
              <Image source={{ uri: review.userAvatar }} style={styles.reviewUserAvatar} />
              <View>
                <Text style={styles.reviewUserName}>{review.userName}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            </View>
            {renderStars(review.rating)}
          </View>
          
          <View style={styles.reviewContent}>
            <Image source={{ uri: review.productImage }} style={styles.reviewProductImage} />
            <View style={styles.reviewTextContainer}>
              <Text style={styles.reviewProductName}>{review.productName}</Text>
              <Text 
                style={styles.reviewText} 
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {review.text}
              </Text>
            </View>
          </View>
          
          <View style={styles.reviewFooter}>
            <View style={styles.helpfulContainer}>
              <Ionicons name="thumbs-up-outline" size={14} color="#666" />
              <Text style={styles.helpfulText}>{review.helpful} found this helpful</Text>
            </View>
            <TouchableOpacity style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Read more</Text>
              <Ionicons name="chevron-forward" size={14} color="#0077b3" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const IndexScreen = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Product selection handler
  const handleProductSelect = (item) => {
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

  // Join as seller
  const handleJoinAsSeller = () => {
    router.push('/register');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeContainer}>
        <NavigationBar showAddButton={true} />
        
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
            {/* Hero banner for guests */}
            <View style={styles.heroBanner}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg' }} 
                style={styles.heroBackground}
              />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>Second-Hand. First Choice.</Text>
                <Text style={styles.heroSubtitle}>Sustainable fashion at affordable prices</Text>
                <View style={styles.heroButtons}>
                  <TouchableOpacity 
                    style={[styles.heroButton, styles.loginButton]}
                    onPress={() => router.push('/Login')}
                  >
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.heroButton, styles.registerButton]}
                    onPress={() => router.push('/register')}
                  >
                    <Text style={styles.registerButtonText}>Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Recently Added Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Added</Text>
              <TouchableOpacity onPress={() => router.push('/recent')}>
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

            {/* Testimonials Section - NEW SECTION */}
            <Testimonials />

            {/* Platform Statistics Section */}
            <PlatformStatistics />

            {/* Top Rated Sellers Section */}
            <TopRatedSellers />

            {/* User Reviews Section - NEW SECTION */}
            <UserReviews />

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
            
            {/* Join as Seller CTA - only for guests */}
            <View style={styles.joinSellerContainer}>
              <View style={styles.joinSellerContent}>
                <Ionicons name="basket-outline" size={40} color="#0077b3" style={styles.joinSellerIcon} />
                <Text style={styles.joinSellerTitle}>Sell Your Pre-Loved Fashion</Text>
                <Text style={styles.joinSellerText}>
                  Join thousands of sellers who have already listed their items.
                  Create an account to start selling today!
                </Text>
                <TouchableOpacity 
                  style={styles.joinSellerButton}
                  onPress={handleJoinAsSeller}
                >
                  <Text style={styles.joinSellerButtonText}>Join as a Seller</Text>
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            
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
            
            {/* Extra padding at bottom */}
            <View style={{ height: 20 }} />
          </ScrollView>
          
          {/* Loading indicator at bottom when loading more */}
          {loading && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#0077b3" />
              <Text style={styles.loadingMoreText}>Loading more...</Text>
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
  
  // Hero Banner styles
  heroBanner: {
    height: 300,
    position: 'relative',
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 25,
  },
  heroButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  heroButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  registerButton: {
    backgroundColor: '#0077b3',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  
  // Join as seller section
  joinSellerContainer: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  joinSellerContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  joinSellerIcon: {
    marginBottom: 10,
  },
  joinSellerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  joinSellerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  },
  joinSellerButton: {
    backgroundColor: "#0077b3",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  joinSellerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
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
  
  // Testimonials styles
  testimonialsContainer: {
    marginVertical: 20,
  },
  testimonialCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  testimonialUserInfo: {
    flex: 1,
  },
  testimonialName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  testimonialLocation: {
    fontSize: 12,
    color: '#777',
  },
  testimonialText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginLeft: 2,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#0077b3',
  },
  
  // Reviews styles
  reviewsContainer: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  reviewUserName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
  },
  reviewStarsContainer: {
    flexDirection: 'row',
  },
  reviewStarIcon: {
    marginLeft: 1,
  },
  reviewContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewProductImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  helpfulContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 12,
    color: '#0077b3',
    fontWeight: '500',
  },
  writeReviewButton: {
    backgroundColor: '#0077b3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 5,
  },
  writeReviewIcon: {
    marginRight: 8,
  },
  writeReviewText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default IndexScreen;