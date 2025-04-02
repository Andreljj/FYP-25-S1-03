// components/NavigationBar.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";

// Define the prop types for the component
interface NavigationBarProps {
  activeTab?: string;  // Current active tab
  showBackButton?: boolean;  // Whether to show back button instead of menu
  onBackPress?: () => void;  // Custom back action if needed
  showAddButton?: boolean;   // Whether to show the add product button
}

// Helper for type-safe navigation
const useAppNavigation = () => {
  const router = useRouter();

  return {
    goToHome: () => router.push("/"),
    goToAboutUs: () => router.push("/aboutUs"),
    goToFaq: () => router.push("/faq"),
    goToLogin: () => router.push("/Login" as any),
    goToRegister: () => router.push("/register" as any),
    goToWishlist: () => router.push("/Wishlist" as any),
    goToCart: () => router.push("/Cart" as any),
    goToProfile: () => router.push("/profile" as any),
  };
};

const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab = "",
  showBackButton = false,
  onBackPress,
  showAddButton = false,
}) => {
  const router = useRouter();
  const navigate = useAppNavigation();

  // Use the auth context to get authentication state
  const { isAuthenticated } = useAuth();

  // State for search functionality
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Category options for filtering
  const filterCategories = ["Tops", "Bottoms", "Outerwear", "Dresses"];

  // Navigation categories
  const categories = ["TOP", "BOTTOM", "FOOTWEAR", "ABOUT US", "FAQ"];

  // Function to clear search and close search bar
  const closeSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearchActive(false);
    setIsFilterVisible(false);
  }, []);

  // Toggle category selection
  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  // Handle navigation
  const handleNavigation = (item: string) => {
    if (item === activeTab) return; // Do nothing if already on this tab

    switch (item) {
      case "TOP":
      case "BOTTOM":
      case "FOOTWEAR":
        navigate.goToHome();
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
      router.push("/Homepage");
    } else {
      router.push("/");
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
        {isSearchActive ? (
          // Render Search Bar in Header with close button
          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                isFilterVisible ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : null
              ]}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              autoFocus={true}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.searchCloseButton}
              onPress={closeSearch}
            >
              <Ionicons name="close-circle" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsFilterVisible(prev => !prev)}
            >
              <Ionicons name="options-outline" size={22} color="#666" />
            </TouchableOpacity>

            {/* Filter dropdown */}
            {isFilterVisible && (
              <View style={styles.filterDropdown}>
                <Text style={styles.filterTitle}>Filter by category:</Text>
                <View style={styles.categoryContainer}>
                  {filterCategories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.categoryChip,
                        selectedCategories.includes(category) && styles.categoryChipSelected
                      ]}
                      onPress={() => toggleCategory(category)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategories.includes(category) && styles.categoryTextSelected
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
                <View style={styles.filterActions}>
                  <TouchableOpacity
                    style={styles.filterActionButton}
                    onPress={() => setSelectedCategories([])}
                  >
                    <Text style={styles.filterActionButtonText}>Clear All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.filterActionButton, styles.applyButton]}
                    onPress={() => setIsFilterVisible(false)}
                  >
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          // Render Header Title and Icons
          <>
            <View style={styles.leftIcons}>
              {showBackButton ? (
                <TouchableOpacity onPress={handleBackPress}>
                  <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
              ) : (
                <Ionicons name="menu" size={28} color="white" />
              )}

              {!showBackButton && (
                <TouchableOpacity
                  onPress={() => setIsSearchActive(true)}
                  style={{ marginLeft: 15 }}
                >
                  <Ionicons name="search-outline" size={28} color="white" />
                </TouchableOpacity>
              )}
            </View>

            {/* Make the logo clickable */}
            <TouchableOpacity onPress={handleLogoPress}>
              <Text style={styles.logo}>TOP CARE FASHION</Text>
            </TouchableOpacity>

            <View style={styles.headerIcons}>
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
          </>
        )}
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
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "BonnieCondensedBlackItalic",
    color: "white"
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
  // Search and filter styles
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
    fontSize: 16,
  },
  searchCloseButton: {
    position: "absolute",
    right: 8,
    padding: 4,
  },
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
});

export default NavigationBar;