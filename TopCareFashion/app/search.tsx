// app/search.tsx
import React, { useState, useEffect } from 'react';
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
import { FILTER_OPTIONS } from './NavigationBar';
import { mockProducts } from './data/mockData';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Single source of truth for filters
  const [filters, setFilters] = useState({
    query: '',
    categories: [],
    sizes: [],
    conditions: [],
    genders: [],
    priceRanges: []
  });
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize from URL params - only once at component mount
  useEffect(() => {
    if (initialized) return;
    
    try {
      // Extract query from URL parameters
      const query = params.query ? String(params.query) : '';
      
      // Extract other filters from URL parameters
      const categories = params.categories ? String(params.categories).split(',') : [];
      const sizes = params.sizes ? String(params.sizes).split(',') : [];
      const conditions = params.conditions ? String(params.conditions).split(',') : [];
      const genders = params.genders ? String(params.genders).split(',') : [];
      
      // Extract price ranges
      const priceRangeIds = params.priceRangeIds ? String(params.priceRangeIds).split(',') : [];
      const priceRanges = [];
      
      if (FILTER_OPTIONS?.PRICE_RANGES && priceRangeIds.length > 0) {
        for (const id of priceRangeIds) {
          const foundRange = FILTER_OPTIONS.PRICE_RANGES.find(range => range.id === id);
          if (foundRange) {
            priceRanges.push(foundRange);
          }
        }
      }
      
      // Set filters from URL params
      setFilters({
        query,
        categories,
        sizes,
        conditions,
        genders,
        priceRanges
      });
      
      setInitialized(true);
    } catch (error) {
      console.error('Error initializing from URL params:', error);
      setInitialized(true);
    }
  }, [params]);
  
  // Filter products when filters change
  useEffect(() => {
    if (!initialized) return;
    
    console.log('Filtering products with:', filters);
    setLoading(true);
    
    try {
      // Safety check for mockProducts
      if (!Array.isArray(mockProducts) || mockProducts.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      // Filter products
      const filtered = mockProducts.filter(product => {
        if (!product) return false;
        
        // Extract filter values
        const { query, categories, sizes, conditions, genders, priceRanges } = filters;
        
        // Check query
        const matchesQuery = !query || 
          (product.name && product.name.toLowerCase().includes(query.toLowerCase()));
        
        // Check categories
        const matchesCategory = categories.length === 0 || 
          (product.category && categories.includes(product.category));
        
        // Check sizes
        const matchesSize = sizes.length === 0 || 
          (product.size && sizes.includes(product.size));
        
        // Check conditions
        const matchesCondition = conditions.length === 0 || 
          (product.condition && conditions.includes(product.condition));
        
        // Check gender
        const matchesGender = genders.length === 0 || 
          (product.gender && genders.includes(product.gender));
        
        // Check price ranges
        const matchesPriceRanges = priceRanges.length === 0 || 
          (typeof product.price === 'number' && priceRanges.some(range => {
            const matchesMin = range.min === null || product.price >= range.min;
            const matchesMax = range.max === null || product.price <= range.max;
            return matchesMin && matchesMax;
          }));
        
        // Combine all filters
        return matchesQuery && matchesCategory && matchesSize && 
          matchesCondition && matchesPriceRanges && matchesGender;
      });
      
      setResults(filtered);
    } catch (error) {
      console.error('Error filtering products:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [filters, initialized]);
  
  // Safety timeout to exit loading state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Safety timeout: exiting loading state');
        setLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [loading]);
  
  // Initialize with all products if needed
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (results.length === 0 && !loading && initialized) {
        console.log('No results, showing all products');
        setResults(mockProducts || []);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [results, loading, initialized]);
  
  // Update filters and optionally update URL
  const updateFilters = (newFilters, updateURL = true) => {
    // Update state
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    
    // Update URL if needed
    if (updateURL) {
      const { query, categories, sizes, conditions, genders, priceRanges } = {
        ...filters,
        ...newFilters
      };
      
      const urlParams = [];
      
      // Add query if exists
      if (query) urlParams.push(`query=${encodeURIComponent(query)}`);
      
      // Add other filters if they exist
      if (categories.length > 0) urlParams.push(`categories=${categories.join(',')}`);
      if (sizes.length > 0) urlParams.push(`sizes=${sizes.join(',')}`);
      if (conditions.length > 0) urlParams.push(`conditions=${conditions.join(',')}`);
      if (genders.length > 0) urlParams.push(`genders=${genders.join(',')}`);
      
      // Add price ranges if they exist
      if (priceRanges.length > 0) {
        const priceRangeIds = priceRanges.map(range => range.id);
        urlParams.push(`priceRangeIds=${priceRangeIds.join(',')}`);
      }
      
      // Construct URL
      const url = `/search${urlParams.length > 0 ? `?${urlParams.join('&')}` : ''}`;
      
      // Update URL without reloading the page
      try {
        window.history.pushState({}, '', url);
      } catch (e) {
        // Fallback for React Native
        router.setParams(urlParams.reduce((acc, param) => {
          const [key, value] = param.split('=');
          acc[key] = value;
          return acc;
        }, {}));
      }
    }
  };
  
  // Remove a filter
  const removeFilter = (type, value) => {
    const newFilters = { ...filters };
    
    switch (type) {
      case 'category':
        newFilters.categories = filters.categories.filter(item => item !== value);
        break;
      case 'size':
        newFilters.sizes = filters.sizes.filter(item => item !== value);
        break;
      case 'condition':
        newFilters.conditions = filters.conditions.filter(item => item !== value);
        break;
      case 'gender':
        newFilters.genders = filters.genders.filter(item => item !== value);
        break;
      case 'priceRange':
        newFilters.priceRanges = filters.priceRanges.filter(range => range.id !== value);
        break;
    }
    
    updateFilters(newFilters);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    updateFilters({
      categories: [],
      sizes: [],
      conditions: [],
      genders: [],
      priceRanges: []
    });
  };
  
  // Check if any filters are applied
  const hasFilters = () => {
    return filters.categories.length > 0 ||
      filters.sizes.length > 0 ||
      filters.conditions.length > 0 ||
      filters.genders.length > 0 ||
      filters.priceRanges.length > 0;
  };
  
  // Format price display
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '$0.00';
    return `$${price.toFixed(2)}`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar showBackButton={true} />
      
      <View style={styles.resultsContainer}>
        {/* Applied filters */}
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
              {filters.genders.map((gender, index) => (
                <View key={`gender-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{gender}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeFilter('gender', gender)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Category filters */}
              {filters.categories.map((category, index) => (
                <View key={`cat-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{category}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeFilter('category', category)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Size filters */}
              {filters.sizes.map((size, index) => (
                <View key={`size-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Size: {size}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeFilter('size', size)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Condition filters */}
              {filters.conditions.map((condition, index) => (
                <View key={`cond-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{condition}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeFilter('condition', condition)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Price range filters */}
              {filters.priceRanges.map((range, index) => (
                <View key={`price-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{range.label}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() => removeFilter('priceRange', range.id)}
                  >
                    <Ionicons name="close-circle" size={18} color="#777" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Search query display */}
        {filters.query && (
          <View style={styles.queryContainer}>
            <Text style={styles.queryText}>
              Search results for: <Text style={styles.queryHighlight}>{filters.query}</Text>
            </Text>
          </View>
        )}
        
        {/* Results */}
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
                keyExtractor={(item) => item.id || String(Math.random())}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={5}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productCard}
                    onPress={() => router.push(`/product/${item.id}`)}
                  >
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
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
    backgroundColor: '#f5f5f5',
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