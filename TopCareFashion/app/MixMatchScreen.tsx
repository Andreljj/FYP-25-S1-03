import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { useWishlist } from './context/WishlistContext';

const categories = ['Top', 'Bottom', 'Footwear'];
const screenWidth = Dimensions.get('window').width;

const MixMatchScreen = () => {
  const router = useRouter();
  const { source } = useLocalSearchParams();
  const [wishlistGrouped, setWishlistGrouped] = useState({ Top: [], Bottom: [], Footwear: [] });

useEffect(() => {
  const fetchGroupedWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('https://topcare-fashion-backend.onrender.com/api/wishlist/mix-match', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setWishlistGrouped(data);
    } catch (err) {
      console.error("❌ Failed to fetch wishlist mix-match:", err);
    }
  };
  fetchGroupedWishlist();
}, []);

  const wishlistItems = [
  ...wishlistGrouped.Top,
  ...wishlistGrouped.Bottom,
  ...wishlistGrouped.Footwear
];


  const [selectedItems, setSelectedItems] = useState({
    Top: null,
    Bottom: null,
    Footwear: null,
  });

  const scaleValues = {
    Top: useSharedValue(1),
    Bottom: useSharedValue(1),
    Footwear: useSharedValue(1),
  };

  const baseScale = {
    Top: useSharedValue(1),
    Bottom: useSharedValue(1),
    Footwear: useSharedValue(1),
  };
  
  const translateX = {
  Top: useSharedValue(1),
  Bottom: useSharedValue(1),
  Footwear: useSharedValue(1),
};

const translateY = {
  Top: useSharedValue(1),
  Bottom: useSharedValue(1),
  Footwear: useSharedValue(1),
};


  const pinchHandlers = {};
categories.forEach((cat) => {
  pinchHandlers[cat] = useAnimatedGestureHandler({
    onActive: (event) => {
      scaleValues[cat].value = baseScale[cat].value * event.scale;
    },
    onEnd: () => {
      baseScale[cat].value = scaleValues[cat].value; // ✅ persist zoom
    },
  });
});


  categories.map((category) => {
  const items = wishlistGrouped[category] || [];
  return (
    <View key={category}>
      {/* Render items here */}
    </View>
  );
});


  // Add this function to determine category based on item description
  const getItemCategory = (item) => {
    const description = (item.description || '').toLowerCase();
    if (description.includes('shirt') || description.includes('top') || description.includes('blouse') || description.includes('jacket')) {
      return 'Top';
    } else if (description.includes('pants') || description.includes('skirt') || description.includes('shorts') || description.includes('bottom')) {
      return 'Bottom';
    } else if (description.includes('shoes') || description.includes('sneakers') || description.includes('boots') || description.includes('footwear')) {
      return 'Footwear';
    }
    return null;
  };

  const handleSelectItem = async (category, item) => {
    try {
      const formData = new FormData();
      formData.append('image_url', item.image);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'jbmsDNvHrpubG1RLcYXTC471',
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Remove.bg error:', await response.text());
        return;
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setSelectedItems(prev => ({
          ...prev,
          [category]: { ...item, image: base64data },
        }));
      };
      reader.onerror = (err) => {
        console.error("FileReader failed", err);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Background removal failed:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mix & Match</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.previewArea}>
            {categories.map((cat) => {
              const animatedStyle = useAnimatedStyle(() => ({
                transform: [
                  { translateX: translateX[cat].value },
                  { translateY: translateY[cat].value },
                  { scale: scaleValues[cat].value },
                ],

              }));
              return (
                <View key={cat} style={styles.previewFrame}>
                  {selectedItems[cat] ? (
                    <PinchGestureHandler onGestureEvent={pinchHandlers[cat]}>
                      <Animated.Image
                        source={{ uri: selectedItems[cat].image }}
                        style={[styles.previewImage, animatedStyle]}
                        resizeMode="contain"
                      />
                    </PinchGestureHandler>
                  ) : (
                    <View style={styles.previewPlaceholder}>
                      <Text style={styles.previewText}>{cat}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <View>
            {categories.map((category) => {
              // Update the filtering logic to use the new category detection
              const items = wishlistGrouped[category] || [];
              return (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {items.length > 0 ? (
                    <FlatList
                      horizontal
                      data={items}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handleSelectItem(category, item)}
                          style={styles.itemCard}
                        >
                          <Image 
                            source={{ uri: item.image }} 
                            style={styles.itemImage}
                            resizeMode="cover"
                          />
                          <Text style={styles.itemDesc} numberOfLines={2}>
                            {item.description}
                          </Text>
                        </TouchableOpacity>
                      )}
                      showsHorizontalScrollIndicator={false}
                    />
                  ) : (
                    <View style={styles.emptyCategory}>
                      <Text style={styles.emptyText}>No {category} items in wishlist</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.suggestButton}>
            <Text style={styles.suggestText}>Get Style Suggestion</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    backgroundColor: '#0077b3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: { padding: 16 },
  previewArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 20,
  },
  previewFrame: {
    width: screenWidth * 0.6,
    height: 160,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  previewText: { fontSize: 14, color: '#aaa' },
  categorySection: { marginBottom: 16 },
  categoryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  itemCard: {
    width: 140,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    padding: 8,
  },
  itemImage: { width: 120, height: 120, borderRadius: 6 },
  itemDesc: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
    marginTop: 6,
  },
  suggestButton: {
    backgroundColor: '#0077b3',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  suggestText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyCategory: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MixMatchScreen;