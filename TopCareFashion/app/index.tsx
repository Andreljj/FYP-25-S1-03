import React, { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReanimatedCarousel from "react-native-reanimated-carousel";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import NavigationBar from './NavigationBar';

const { width } = Dimensions.get("window");

// Prevent splash screen from auto-hiding before fonts load
SplashScreen.preventAutoHideAsync();

// Sample recommendations data with more details
const recommendedItems = [
  {
    id: "1",
    name: "Checkered H&M Shirt",
    image: "https://images.hardloop.fr/587266-large_default/wrangler-mixed-material-shirt-second-hand-shirt-mens-multicolored-l.jpg",
    price: "$28.50",
    description: "Classic checkered pattern shirt with button-down collar. Made from soft, breathable cotton blend fabric. Perfect for casual or semi-formal occasions.",
    size: "S, M, L, XL",
    condition: "Like New"
  },
  {
    id: "2",
    name: "Purple Baju Kurung",
    image: "https://daganghalal.blob.core.windows.net/42742/Product/baju-kurung-moden-songket-1704693764101.jpg",
    price: "$45.99",
    description: "Elegant traditional attire in vibrant purple. Features delicate embroidery and a modern cut. Comfortable for all-day wear during celebrations or formal events.",
    size: "S, M, L",
    condition: "Excellent"
  },
  {
    id: "3",
    name: "Khaki Jacket",
    image: "https://static2.goldengoose.com/public/Style/ECOMM/GMP00834.P001488-15527.jpg",
    price: "$39.75",
    description: "Versatile khaki jacket with quilted design. Features ribbed collar and cuffs, multiple pockets, and premium quality material. Ideal for cool weather.",
    size: "M, L, XL",
    condition: "Good"
  },
];

// Enhanced testimonials with longer, more detailed reviews
const testimonials = [
  {
    id: "1",
    name: "Carmen Johnson",
    review: "I've sold over 10 designer pieces on TOP CARE FASHION in just 2 months! The platform is incredibly user-friendly, and I love how they verify each item's authenticity. The commission rates are fair, and payments are always processed promptly. I've found a wonderful community of fashion enthusiasts who appreciate sustainable shopping as much as I do!",
    image: "https://cdn.pixabay.com/photo/2023/10/17/03/23/child-8320341_640.png",
    rating: 5
  },
  {
    id: "2",
    name: "John Doe",
    review: "After struggling to find affordable designer pieces in my area, TOP CARE FASHION has been a game-changer! I purchased a vintage Burberry trench coat for half the retail price, and it arrived exactly as described—in perfect condition. The seller was responsive and shipping was fast. I've since bought four more items and each transaction has been seamless. Highly recommend for quality second-hand fashion!",
    image: "https://res.cloudinary.com/ybmedia/image/upload/c_scale,f_auto,q_auto,w_1.35/v1/m/5/4/5400778035f154dfd64368d39291b4c0c85dc56a/thumb_16x9/cartoon-characters-century-already-iconic.jpg",
    rating: 4
  },
];

// Function to render star ratings with improved spacing
const StarRating = ({ rating }) => (
  <View style={styles.starContainer}>
    {[...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={22}
        color="#FFD700"
        style={styles.starIcon}
      />
    ))}
  </View>
);

export default function HomeScreen() {
  const router = useRouter();

  // All hooks must be called at the top level
  const [fontsLoaded] = useFonts({
    "BonnieCondensedBlackItalic": require("../assets/fonts/BonnieCondensedBlackItalic.ttf"),
  });

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Category options for filtering - define outside of render function
  const filterCategories = ["Tops", "Bottoms", "Outerwear", "Dresses", "Accessories", "Footwear"];

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Function to clear search and close search bar
  const closeSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearchActive(false);
  }, []);

  // Toggle category selection with proper type annotation
  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  // Navigate to product details page - this is the key function for navigation
  const navigateToProductDetails = useCallback((productId) => {
    console.log("Navigating to product:", productId);
    router.push(`/product/${productId}`);
  }, [router]);

  // Use this instead of conditional rendering for the entire component
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={styles.container} onLayout={onLayoutRootView}>

          <NavigationBar />

          {/* Hero Image */}
          <Image source={require('./images/Top Care banner.png')} style={styles.heroImage} />

          {/* Slashed Prices Section */}
          <Text style={styles.sectionTitle}>Slashed Prices</Text>
          <FlatList
            horizontal
            data={recommendedItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCardTouchable}
                onPress={() => navigateToProductDetails(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.productCard}>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                  </View>
                  <Ionicons name="chevron-forward-circle" size={24} color="#0077b3" style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />

          {/* Testimonials Section */}
          <Text style={styles.sectionTitle}>Testimonies</Text>
          <View style={styles.carouselWrapper}>
            <ReanimatedCarousel
              loop
              width={width}
              height={400}
              autoPlay
              autoPlayInterval={5000}
              data={testimonials}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <View style={styles.testimonialCard}>
                  <Ionicons name="chatbubble-ellipses" size={30} color="#ffffff80" style={styles.quoteIcon} />
                  <Image source={{ uri: item.image }} style={styles.testimonialImage} />
                  <Text style={styles.testimonialName}>{item.name}</Text>
                  <StarRating rating={item.rating} />
                  <Text style={styles.testimonialText}>{item.review}</Text>
                </View>
              )}
            />
          </View>

          {/* Extra space to prevent footer overlap */}
          <View style={{ height: 50 }} />

        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#0077b3" },
  container: { flex: 1, backgroundColor: "#f8f8f8" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0077b3",
    zIndex: 1000
  },

  leftIcons: { flexDirection: "row", alignItems: "center" },
  logo: { fontSize: 24, fontWeight: "bold", fontFamily: "BonnieCondensedBlackItalic", color: "white" },
  headerIcons: { flexDirection: "row", alignItems: "center" },

  navBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    paddingTop: 20,
    backgroundColor: "#f8f8f8",
    zIndex: 900
  },

  navItemContainer: { flexDirection: "row", alignItems: "center" },
  navItem: { fontSize: 14, fontWeight: "600", paddingHorizontal: 10 },
  navSeparator: { fontSize: 16, color: "gray" },

  searchBar: {
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  // Updated search styles
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginRight: 10,
    zIndex: 1000,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingRight: 40, // Make room for the close icon
    backgroundColor: "white",
    fontSize: 16
  },
  searchCloseButton: {
    position: "absolute",
    right: 8,
    padding: 4,
  },

  //filter search
  filterButton: {
    position: "absolute",
    right: 40, // Position before the close button
    padding: 8,
  },
  filterDropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#ccc",
    padding: 12,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  categoryChipSelected: {
    backgroundColor: "#0077b3",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  categoryTextSelected: {
    color: "white",
  },
  checkIcon: {
    marginLeft: 4,
  },
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  filterActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  applyButton: {
    backgroundColor: "#0077b3",
  },
  filterActionButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "500",
  },

  heroImage: { width: "100%", height: 200, resizeMode: "cover" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    marginLeft: 15,
    color: "#0077b3"
  },

  // Updated product card styles for better UI and clickable indication
  productCardTouchable: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productCard: {
    alignItems: "center",
    padding: 10,
    width: 150,
    position: "relative",
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10
  },
  productInfo: {
    width: "100%",
    marginTop: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#0077b3",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
    color: "#333",
  },
  arrowIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    opacity: 0.7,
  },
  emptyListText: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 },

  // Updated testimonial section with improved styling
  carouselWrapper: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  testimonialCard: {
    backgroundColor: "rgba(0, 119, 179, 0.8)",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    width: width * 0.93,
    height: 350,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    position: "relative",
  },
  testimonialImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
  },
  testimonialName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    color: "#fff",
  },
  testimonialText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
    color: "#fff",
    paddingHorizontal: 10,
  },
  quoteIcon: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  // Improved star rating with better spacing
  starContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 5,
  },
  starIcon: {
    marginHorizontal: 4,
  }
});