// components/SearchBar.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Create a simpler version with basic, reliable functionality
export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Basic filter states
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [conditions, setConditions] = useState([]);
  
  // Available filter options - keep them consistent throughout the app
  const filterOptions = {
    categories: ["Tops", "Bottoms", "Outerwear", "Footwear", "Dresses"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "One Size"],
    conditions: ["New with tags", "Like new", "Excellent", "Good", "Fair", "Poor"]
  };
  
  // Debug functions to track state changes
  const logCurrentState = () => {
    console.log("Current search state:", {
      query,
      categories,
      sizes,
      conditions
    });
  };
  
  // Toggle a filter value
  const toggleFilter = (type, value) => {
    console.log(`Toggling ${type}: ${value}`);
    
    switch (type) {
      case "category":
        setCategories(prev => {
          if (prev.includes(value)) {
            return prev.filter(item => item !== value);
          } else {
            return [...prev, value];
          }
        });
        break;
      case "size":
        setSizes(prev => {
          if (prev.includes(value)) {
            return prev.filter(item => item !== value);
          } else {
            return [...prev, value];
          }
        });
        break;
      case "condition":
        setConditions(prev => {
          if (prev.includes(value)) {
            return prev.filter(item => item !== value);
          } else {
            return [...prev, value];
          }
        });
        break;
      default:
        break;
    }
    
    // Log state after toggling (will show previous state due to React's state batching)
    setTimeout(logCurrentState, 0);
  };
  
  // Clear all filters
  const clearFilters = () => {
    console.log("Clearing all filters");
    setCategories([]);
    setSizes([]);
    setConditions([]);
  };
  
  // Handle search submission
  const handleSearch = () => {
    try {
      console.log("Searching with:", {
        query,
        categories,
        sizes,
        conditions
      });
      
      if (onSearch) {
        onSearch(query, { categories, sizes, conditions });
      } else {
        console.error("No onSearch function provided to SearchBar");
      }
    } catch (error) {
      console.error("Error in search:", error);
      Alert.alert("Search Error", "An error occurred while searching. Please try again.");
    }
  };
  
  // Count active filters
  const getActiveFilterCount = () => {
    return categories.length + sizes.length + conditions.length;
  };
  
  return (
    <View style={styles.container}>
      {/* Search input */}
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        
        {/* Search button */}
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={22} color="#0077b3" />
        </TouchableOpacity>
        
        {/* Filter button */}
        <TouchableOpacity 
          onPress={() => setShowFilters(!showFilters)} 
          style={styles.filterButton}
        >
          <Ionicons name="options" size={22} color="#0077b3" />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Filter panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {filterOptions.categories.map((category) => (
                  <TouchableOpacity
                    key={`cat-${category}`}
                    style={[
                      styles.filterChip,
                      categories.includes(category) && styles.filterChipSelected
                    ]}
                    onPress={() => toggleFilter("category", category)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        categories.includes(category) && styles.filterChipTextSelected
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {/* Sizes */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sizes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {filterOptions.sizes.map((size) => (
                  <TouchableOpacity
                    key={`size-${size}`}
                    style={[
                      styles.filterChip,
                      sizes.includes(size) && styles.filterChipSelected
                    ]}
                    onPress={() => toggleFilter("size", size)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        sizes.includes(size) && styles.filterChipTextSelected
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {/* Conditions */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Condition</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {filterOptions.conditions.map((condition) => (
                  <TouchableOpacity
                    key={`cond-${condition}`}
                    style={[
                      styles.filterChip,
                      conditions.includes(condition) && styles.filterChipSelected
                    ]}
                    onPress={() => toggleFilter("condition", condition)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        conditions.includes(condition) && styles.filterChipTextSelected
                      ]}
                    >
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {/* Filter actions */}
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={() => {
                handleSearch();
                setShowFilters(false);
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingRight: 80, // Space for buttons
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  searchButton: {
    position: "absolute",
    right: 45,
    padding: 8,
  },
  filterButton: {
    position: "absolute",
    right: 12,
    padding: 8,
  },
  filterBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  filterPanel: {
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterSection: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterChip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipSelected: {
    backgroundColor: "#0077b3",
  },
  filterChipText: {
    fontSize: 14,
    color: "#333",
  },
  filterChipTextSelected: {
    color: "white",
  },
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  clearButtonText: {
    color: "#666",
  },
  applyButton: {
    backgroundColor: "#0077b3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "500",
  }
});