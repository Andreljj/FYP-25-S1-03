// app/search.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from './NavigationBar';
import { FILTER_OPTIONS } from './NavigationBar'; // Import filter options from NavigationBar
import { mockProducts } from './data/mockData'; // Import standardized data

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<Array<{
    min: number | null;
    max: number | null;
    id: string;
    label: string;
  }>>([]);

  // Ref to track if we're currently handling a URL change
  const isHandlingUrlChange = useRef(false);
  // Ref to track if filters have been applied at least once
  const filtersApplied = useRef(false);

  // Parse URL parameters and update state
  useEffect(() => {
    console.log('URL parameters changed:', params);

    // Skip if we're the ones who triggered the URL change
    if (isHandlingUrlChange.current) {
      isHandlingUrlChange.current = false;
      return;
    }

    // Only set loading on first load or explicit search
    if (!filtersApplied.current) {
      setLoading(true);
    }

    // Extract query and filters from URL parameters
    const query = params.query as string || '';
    setSearchQuery(query);

    if (params.categories) {
      const categories = (params.categories as string).split(',');
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }

    if (params.sizes) {
      const sizes = (params.sizes as string).split(',');
      setSelectedSizes(sizes);
    } else {
      setSelectedSizes([]);
    }

    if (params.conditions) {
      const conditions = (params.conditions as string).split(',');
      setSelectedConditions(conditions);
    } else {
      setSelectedConditions([]);
    }

    // Handle gender filters
    if (params.genders) {
      const genders = (params.genders as string).split(',');
      setSelectedGenders(genders);
    } else {
      setSelectedGenders([]);
    }

    // Handle price ranges
    const priceRangeIds = params.priceRangeIds ? (params.priceRangeIds as string).split(',') : [];
    const newPriceRanges = [];

    if (priceRangeIds.length > 0) {
      for (const id of priceRangeIds) {
        const foundRange = FILTER_OPTIONS.PRICE_RANGES.find(range => range.id === id);
        if (foundRange) {
          newPriceRanges.push({
            min: foundRange.min,
            max: foundRange.max,
            id: foundRange.id,
            label: foundRange.label
          });
        }
      }
    }

    setPriceRanges(newPriceRanges);

    // Mark filters as applied
    filtersApplied.current = true;

    // Delay clearing loading state for UX
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [params]);

  // Effect to apply filtering when filter state changes
  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [searchQuery, selectedCategories, selectedSizes, selectedConditions, selectedGenders, priceRanges, loading]);

  // Filter products function
  const applyFilters = () => {
    console.log("Applying filters with:", {
      query: searchQuery,
      categories: selectedCategories,
      sizes: selectedSizes,
      conditions: selectedConditions,
      priceRanges: priceRanges.map(r => r.id),
      genders: selectedGenders
    });

    const filtered = mockProducts.filter(product => {
      // Filter by search query
      const matchesQuery = !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by categories
      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      // Filter by sizes
      const matchesSize = selectedSizes.length === 0 ||
        selectedSizes.includes(product.size);

      // Filter by conditions
      const matchesCondition = selectedConditions.length === 0 ||
        selectedConditions.includes(product.condition);

      // Filter by gender
      const matchesGender = selectedGenders.length === 0 ||
        selectedGenders.includes(product.gender);

      // Add debugging for gender matching
      if (selectedGenders.length > 0 && !matchesGender) {
        console.log(`Product ${product.id} (${product.name}) gender: ${product.gender} did not match selected genders:`, selectedGenders);
      }

      // Filter by price ranges
      const matchesPriceRanges = priceRanges.length === 0 ||
        priceRanges.some(range => {
          const matchesMin = range.min === null || product.price >= range.min;
          const matchesMax = range.max === null || product.price <= range.max;
          return matchesMin && matchesMax;
        });

      return matchesQuery && matchesCategory && matchesSize &&
        matchesCondition && matchesPriceRanges && matchesGender;
    });

    console.log(`Found ${filtered.length} products matching criteria`);
    setResults(filtered);
  };

  // Navigate to search with updated parameters
  const navigateWithUpdatedFilters = (updatedFilters) => {
    // Mark that we're initiating a URL change
    isHandlingUrlChange.current = true;

    // Get the current query
    const query = searchQuery;

    // Construct new parameters
    const params = [];

    // Add query parameter if exists
    if (query) params.push(`query=${encodeURIComponent(query)}`);

    // Add categories parameter if any categories are selected
    if (updatedFilters.categories?.length > 0) {
      params.push(`categories=${updatedFilters.categories.join(',')}`);
    }

    // Add sizes parameter if any sizes are selected
    if (updatedFilters.sizes?.length > 0) {
      params.push(`sizes=${updatedFilters.sizes.join(',')}`);
    }

    // Add conditions parameter if any conditions are selected
    if (updatedFilters.conditions?.length > 0) {
      params.push(`conditions=${updatedFilters.conditions.join(',')}`);
    }

    // Add gender parameter if any genders are selected
    if (updatedFilters.genders?.length > 0) {
      params.push(`genders=${updatedFilters.genders.join(',')}`);
    }

    // Add price range parameters if any price ranges are selected
    if (updatedFilters.priceRanges?.length > 0) {
      const priceRangeIds = updatedFilters.priceRanges.map(range => range.id);
      params.push(`priceRangeIds=${priceRangeIds.join(',')}`);
    }

    // Construct the query string
    const queryString = params.join('&');

    // Navigate to the search route with the updated parameters
    router.push(`/search?${queryString}`);
  };

  // Remove a category filter
  const removeCategory = (category: string) => {
    const newCategories = selectedCategories.filter(item => item !== category);
    setSelectedCategories(newCategories);

    navigateWithUpdatedFilters({
      categories: newCategories,
      sizes: selectedSizes,
      conditions: selectedConditions,
      priceRanges: priceRanges,
      genders: selectedGenders
    });
  };

  // Remove a size filter
  const removeSize = (size: string) => {
    const newSizes = selectedSizes.filter(item => item !== size);
    setSelectedSizes(newSizes);

    navigateWithUpdatedFilters({
      categories: selectedCategories,
      sizes: newSizes,
      conditions: selectedConditions,
      priceRanges: priceRanges,
      genders: selectedGenders
    });
  };

  // Remove a condition filter
  const removeCondition = (condition: string) => {
    const newConditions = selectedConditions.filter(item => item !== condition);
    setSelectedConditions(newConditions);

    navigateWithUpdatedFilters({
      categories: selectedCategories,
      sizes: selectedSizes,
      conditions: newConditions,
      priceRanges: priceRanges,
      genders: selectedGenders
    });
  };

  // Remove a gender filter
  const removeGender = (gender: string) => {
    const newGenders = selectedGenders.filter(item => item !== gender);
    setSelectedGenders(newGenders);

    navigateWithUpdatedFilters({
      categories: selectedCategories,
      sizes: selectedSizes,
      conditions: selectedConditions,
      priceRanges: priceRanges,
      genders: newGenders
    });
  };

  // Remove price range filter
  const removePriceRange = (priceRangeId: string) => {
    const newPriceRanges = priceRanges.filter(range => range.id !== priceRangeId);
    setPriceRanges(newPriceRanges);

    navigateWithUpdatedFilters({
      categories: selectedCategories,
      sizes: selectedSizes,
      conditions: selectedConditions,
      priceRanges: newPriceRanges,
      genders: selectedGenders
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    // Reset all filters
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setPriceRanges([]);
    setSelectedGenders([]);

    // Mark that we're initiating a URL change
    isHandlingUrlChange.current = true;

    // If there's a search query, keep only that parameter
    const query = searchQuery || '';

    // Navigate with only the query parameter
    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    } else {
      router.push('/search');
    }
  };

  // Check if any filters are applied
  const hasFilters = () => {
    return selectedCategories.length > 0 ||
      selectedSizes.length > 0 ||
      selectedConditions.length > 0 ||
      priceRanges.length > 0 ||
      selectedGenders.length > 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar showBackButton={true} />

      <View style={styles.resultsContainer}>
        {/* Show applied filters */}
        {hasFilters() && (
          <View style={styles.filtersContainer}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Applied Filters:</Text>
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScrollContent}
            >
              {/* Gender filters */}
              {selectedGenders.map((gender, index) => (
                <View key={`gender-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{gender}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeGender(gender)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Category filters */}
              {selectedCategories.map((category, index) => (
                <View key={`cat-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{category}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeCategory(category)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Size filters */}
              {selectedSizes.map((size, index) => (
                <View key={`size-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Size: {size}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeSize(size)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Condition filters */}
              {selectedConditions.map((condition, index) => (
                <View key={`cond-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{condition}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeCondition(condition)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Price range filters */}
              {priceRanges.map((range, index) => (
                <View key={`price-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{range.label}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removePriceRange(range.id)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search query display */}
        {searchQuery && (
          <View style={styles.queryContainer}>
            <Text style={styles.queryText}>
              Search results for: <Text style={styles.queryHighlight}>{searchQuery}</Text>
            </Text>
          </View>
        )}

        {/* Results count and list */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0077b3" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{results.length} items found</Text>
            </View>

            {results.length > 0 ? (
              <FlatList
                data={results}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productCard}
                    onPress={() => router.push(`/product/${item.id}`)}
                  >
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                      <View style={styles.productMeta}>
                        <Text style={styles.productSize}>{item.size}</Text>
                        <Text style={styles.productCondition}>{item.condition}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.productGrid}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
                {hasFilters() && (
                  <TouchableOpacity
                    style={styles.clearFiltersButton}
                    onPress={clearAllFilters}
                  >
                    <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077b3',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  // Applied filters styles
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  clearAllButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  clearAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  filtersScrollContent: {
    paddingHorizontal: 10,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf7ff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#d0e8fa',
  },
  filterTagText: {
    fontSize: 14,
    color: '#0077b3',
    marginRight: 8,
  },
  removeTagButton: {
    padding: 2,
  },
  // Query display styles
  queryContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  queryText: {
    fontSize: 14,
    color: '#666',
  },
  queryHighlight: {
    fontWeight: 'bold',
    color: '#333',
  },
  // Results styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  resultsHeader: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  productGrid: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077b3',
    marginBottom: 5,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productSize: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productCondition: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e0f2ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: '#0077b3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  clearFiltersButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});