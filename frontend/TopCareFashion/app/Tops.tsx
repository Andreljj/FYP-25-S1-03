// app/tops.tsx
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
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from './NavigationBar';
import { mockTops } from './data/mockData';

// Sorting options
const SORT_OPTIONS = [
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'date_newest', label: 'Date: Newest First' },
  { id: 'date_oldest', label: 'Date: Oldest First' }
];

export default function TopsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(mockTops);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
  const [showSortModal, setShowSortModal] = useState(false);

  // Apply sorting
  useEffect(() => {
    // Clone the array to avoid mutating the original
    const sortedProducts = [...mockTops];
    
    // Sort based on selected option
    switch (sortOption.id) {
      case 'price_asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'date_newest':
        sortedProducts.sort((a, b) => b.datePosted.getTime() - a.datePosted.getTime());
        break;
      case 'date_oldest':
        sortedProducts.sort((a, b) => a.datePosted.getTime() - b.datePosted.getTime());
        break;
      default:
        // Default to price ascending
        sortedProducts.sort((a, b) => a.price - b.price);
    }
    
    setProducts(sortedProducts);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [sortOption]);

  // Format date function
  const formatDate = (date) => {
    // Get time difference in days
    const timeDiff = Math.round((new Date() - date) / (1000 * 60 * 60 * 24));
    
    if (timeDiff === 0) {
      return 'Today';
    } else if (timeDiff === 1) {
      return 'Yesterday';
    } else if (timeDiff < 7) {
      return `${timeDiff} days ago`;
    } else if (timeDiff < 30) {
      const weeks = Math.floor(timeDiff / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      // Use date string for older posts
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Handle sort selection
  const handleSortSelection = (option) => {
    setSortOption(option);
    setShowSortModal(false);
    setLoading(true); // Show loading state while sorting
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar showBackButton={true} activeTab="TOP" />
      
      <View style={styles.pageContainer}>
        {/* Header with title and sort button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tops</Text>
          
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="filter-outline" size={20} color="#333" />
            <Text style={styles.sortButtonText}>{sortOption.label}</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </TouchableOpacity>
        </View>
        
        {/* Results count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>{products.length} items found</Text>
        </View>
        
        {/* Products list */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0077b3" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={products}
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
                  <Text style={styles.datePosted}>{formatDate(item.datePosted)}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.productGrid}
          />
        )}
        
        {/* Sort Modal */}
        <Modal
          visible={showSortModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSortModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSortModal(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sort By</Text>
              
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    sortOption.id === option.id && styles.sortOptionSelected
                  ]}
                  onPress={() => handleSortSelection(option)}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortOption.id === option.id && styles.sortOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {sortOption.id === option.id && (
                    <Ionicons name="checkmark" size={20} color="#0077b3" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077b3',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 8,
  },
  resultsHeader: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
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
    marginBottom: 8,
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
  datePosted: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  sortOptionTextSelected: {
    color: '#0077b3',
    fontWeight: '500',
  },
});