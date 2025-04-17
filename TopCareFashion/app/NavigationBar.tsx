// NavigationBar.tsx - Updated with gender filter
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import * as Font from 'expo-font';

// Define the prop types for the component
interface NavigationBarProps {
  activeTab?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showAddButton?: boolean;
}

// FILTER_OPTIONS
export const FILTER_OPTIONS = {
  CATEGORIES: ["Tops", "Bottoms", "Outerwear", "Footwear", "Dresses"],
  SIZES: ["XS", "S", "M", "L", "XL", "XXL", "One Size"],
  CONDITIONS: ["New with tags", "Like new", "Excellent", "Good", "Fair", "Poor"],
  PRICE_RANGES: [
    { id: "p1", label: "Under $25", min: 0, max: 25 },
    { id: "p2", label: "$25-$50", min: 25, max: 50 },
    { id: "p3", label: "$50-$100", min: 50, max: 100 },
    { id: "p4", label: "$100-$200", min: 100, max: 200 },
    { id: "p5", label: "Over $200", min: 200, max: null }
  ],
  GENDERS: ["Men", "Women", "Unisex"]
};

// Helper for type-safe navigation
const useAppNavigation = () => {
  const router = useRouter();

  return {
    goToHome: () => router.push("/Homepage"),
    goToIndex: () => router.push("/"),
    goToAboutUs: () => router.push("/aboutUs"),
    goToFaq: () => router.push("/faq"),
    goToLogin: () => router.push("/Login" as any),
    goToRegister: () => router.push("/register" as any),
    goToWishlist: () => router.push("/Wishlist" as any),
    goToCart: () => router.push("/Cart" as any),
<<<<<<< HEAD
    goToProfile: () => router.push("/profile" as any),
    goToCategory: (category: string) => router.push(`/${category.toLowerCase()}` as any),
    goToProfile: () => router.push("/Profile" as any),
>>>>>>> b3c690b (Add personalized dashboard and update account details)
  };
};

const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab = "",
  showBackButton = false,
  onBackPress,
  showAddButton = false
}) => {
  const router = useRouter();
  const navigate = useAppNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  
  // Load custom fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'BonnieCondensedBlackItalic': require('../assets/fonts/BonnieCondensedBlackItalic.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // If font loading fails, continue without custom font
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  // Use the auth context to get authentication state
  const { isAuthenticated } = useAuth();

  // Navigation categories
  const categories = ["TOP", "BOTTOM", "FOOTWEAR", "ABOUT US", "FAQ"];

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(item => item !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  // Toggle condition selection
  const toggleCondition = (condition) => {
    setSelectedConditions(prev => {
      if (prev.includes(condition)) {
        return prev.filter(item => item !== condition);
      } else {
        return [...prev, condition];
      }
    });
  };

  // Toggle price range selection
  const togglePriceRange = (priceRangeId) => {
    setSelectedPriceRanges(prev => {
      if (prev.includes(priceRangeId)) {
        return prev.filter(id => id !== priceRangeId);
      } else {
        return [...prev, priceRangeId];
      }
    });
  };

  // Toggle gender selection
  const toggleGender = (gender) => {
    setSelectedGenders(prev => {
      if (prev.includes(gender)) {
        return prev.filter(item => item !== gender);
      } else {
        return [...prev, gender];
      }
    });
  };

  // Get selected price range objects
  const getSelectedPriceRanges = () => {
    if (selectedPriceRanges.length === 0) return [];
    return FILTER_OPTIONS.PRICE_RANGES.filter(range => selectedPriceRanges.includes(range.id));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setSelectedPriceRanges([]);
    setSelectedGenders([]);
  };

  // Handle search submission
  const handleSearch = () => {
    console.log("Executing search:", {
      query: searchQuery,
      categories: selectedCategories,
      sizes: selectedSizes,
      conditions: selectedConditions,
      priceRanges: getSelectedPriceRanges(),
      genders: selectedGenders
    });

    // Hide search UI
    setShowSearch(false);

    // Navigate to search results page with parameters
    const priceRanges = getSelectedPriceRanges();
    const params = [];

    if (searchQuery) params.push(`query=${encodeURIComponent(searchQuery)}`);
    if (selectedCategories.length > 0) params.push(`categories=${selectedCategories.join(',')}`);
    if (selectedSizes.length > 0) params.push(`sizes=${selectedSizes.join(',')}`);
    if (selectedConditions.length > 0) params.push(`conditions=${selectedConditions.join(',')}`);
    if (selectedGenders.length > 0) params.push(`genders=${selectedGenders.join(',')}`);

    if (priceRanges.length > 0) {
      params.push(`priceRangeIds=${priceRanges.map(range => range.id).join(',')}`);
    }

    const queryString = params.join('&');
    router.push(`/search?${queryString}`);
  };

// Handle navigation
const handleNavigation = (item: string) => {
  if (item === activeTab) return; // Do nothing if already on this tab

  switch (item) {
    case "TOP":
      router.push("/Tops");
      break;
    case "BOTTOM":
      router.push("/Bottom");
      break;
    case "FOOTWEAR":
      router.push("/Footwear");
      break;
    case "ABOUT US":
      navigate.goToAboutUs();
      break;
    case "FAQ":
      navigate.goToFaq();
      break;
    default:
      break;
  }
};

  // Function to handle logo press
  const handleLogoPress = () => {
    // Navigate to Homepage if logged in, otherwise to index
    if (isAuthenticated) {
      navigate.goToHome();
    } else {
      navigate.goToIndex();
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setShowSearch(true)}
            >
              <Ionicons name="search-outline" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Make the logo clickable */}
        <TouchableOpacity onPress={handleLogoPress}>
          <Text style={[styles.logo, fontsLoaded && { fontFamily: 'BonnieCondensedBlackItalic' }]}>
            TOP CARE FASHION
          </Text>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          {showAddButton && isAuthenticated && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/ProductListing')}
            >
              <Ionicons name="add-circle-outline" size={22} color="white" style={styles.addIcon} />
              <Text style={styles.addButtonText}>List</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => isAuthenticated ? navigate.goToWishlist() : navigate.goToRegister()}
          >
            <Ionicons name="heart-outline" size={28} color="white" style={{ marginRight: 15 }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => isAuthenticated ? navigate.goToCart() : navigate.goToRegister()}
          >
            <Ionicons name="cart-outline" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => isAuthenticated ? navigate.goToProfile() : navigate.goToLogin()}
          >
            <Ionicons name="person-circle-outline" size={28} color="white" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItemContainer}
            onPress={() => handleNavigation(item)}
          >
            <Text
              style={[
                styles.navItem,
                item === activeTab ? styles.activeNavItem : null
              ]}
            >
              {item}
            </Text>
            {index < categories.length - 1 && <Text style={styles.navSeparator}>|</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Modal */}
      <Modal
        visible={showSearch}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearch(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Products</Text>
              <TouchableOpacity onPress={() => setShowSearch(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search products..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSearchQuery('')}
                  >
                    <Ionicons name="close-circle" size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Gender Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Gender</Text>
                <View style={styles.filterChips}>
                  {FILTER_OPTIONS.GENDERS.map((gender, index) => (
                    <TouchableOpacity
                      key={`gender-${index}`}
                      style={[
                        styles.filterChip,
                        selectedGenders.includes(gender) && styles.filterChipSelected
                      ]}
                      onPress={() => toggleGender(gender)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedGenders.includes(gender) && styles.filterChipTextSelected
                        ]}
                      >
                        {gender}
                      </Text>
                      {selectedGenders.includes(gender) && (
                        <Ionicons name="checkmark" size={14} color="white" style={styles.checkIcon} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Categories</Text>
                <View style={styles.filterChips}>
                  {FILTER_OPTIONS.CATEGORIES.map((category, index) => (
                    <TouchableOpacity
                      key={`cat-${index}`}
                      style={[
                        styles.filterChip,
                        selectedCategories.includes(category) && styles.filterChipSelected
                      ]}
                      onPress={() => toggleCategory(category)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedCategories.includes(category) && styles.filterChipTextSelected
                        ]}
                      >
                        {category}
                      </Text>
                      {selectedCategories.includes(category) && (
                        <Ionicons name="checkmark" size={14} color="white" style={styles.checkIcon} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Size Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Sizes</Text>
                <View style={styles.filterChips}>
                  {FILTER_OPTIONS.SIZES.map((size, index) => (
                    <TouchableOpacity
                      key={`size-${index}`}
                      style={[
                        styles.filterChip,
                        selectedSizes.includes(size) && styles.filterChipSelected
                      ]}
                      onPress={() => toggleSize(size)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedSizes.includes(size) && styles.filterChipTextSelected
                        ]}
                      >
                        {size}
                      </Text>
                      {selectedSizes.includes(size) && (
                        <Ionicons name="checkmark" size={14} color="white" style={styles.checkIcon} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Price Range</Text>
                <View style={styles.filterChips}>
                  {FILTER_OPTIONS.PRICE_RANGES.map((price) => (
                    <TouchableOpacity
                      key={`price-${price.id}`}
                      style={[
                        styles.filterChip,
                        selectedPriceRanges.includes(price.id) && styles.filterChipSelected
                      ]}
                      onPress={() => togglePriceRange(price.id)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedPriceRanges.includes(price.id) && styles.filterChipTextSelected
                        ]}
                      >
                        {price.label}
                      </Text>
                      {selectedPriceRanges.includes(price.id) && (
                        <Ionicons name="checkmark" size={14} color="white" style={styles.checkIcon} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Condition Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Condition</Text>
                <View style={styles.filterChips}>
                  {FILTER_OPTIONS.CONDITIONS.map((condition, index) => (
                    <TouchableOpacity
                      key={`cond-${index}`}
                      style={[
                        styles.filterChip,
                        selectedConditions.includes(condition) && styles.filterChipSelected
                      ]}
                      onPress={() => toggleCondition(condition)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedConditions.includes(condition) && styles.filterChipTextSelected
                        ]}
                      >
                        {condition}
                      </Text>
                      {selectedConditions.includes(condition) && (
                        <Ionicons name="checkmark" size={14} color="white" style={styles.checkIcon} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  addIcon: {
    marginRight: Platform.OS === 'web' ? 5 : 0,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0077b3",
    zIndex: 1000
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    fontSize: 28, // Increased size for better display with custom font
    fontWeight: "bold",
    color: "white",
    // Note: fontFamily will be conditionally applied when fonts are loaded
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#f8f8f8",
    zIndex: 900
  },
  navItemContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  navItem: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10
  },
  activeNavItem: {
    color: "#0077b3",
    fontWeight: "700",
  },
  navSeparator: {
    fontSize: 16,
    color: "gray"
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  filterSection: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
  },
  filterChipSelected: {
    backgroundColor: '#0077b3',
  },
  filterChipText: {
    fontSize: 14,
    color: '#333',
  },
  filterChipTextSelected: {
    color: 'white',
  },
  checkIcon: {
    marginLeft: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearFiltersButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearFiltersText: {
    color: '#666',
  },
  searchButton: {
    backgroundColor: '#0077b3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default NavigationBar;