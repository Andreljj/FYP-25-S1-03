import React, { useCallback } from 'react';
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from './NavigationBar'; // Adjust path if needed
import { useAuth } from './context/AuthContext'; // Import useAuth hook
import { useRouter } from 'expo-router'; // Import useRouter

const HomepageScreen = () => {
  const { isAuthenticated } = useAuth(); // Get authentication state
  const router = useRouter(); // Get the router
  
  // Add product handler function
  const handleAddProduct = () => {
    router.push('/ProductListing');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeContainer}>
        <NavigationBar activeTab="TOP" />
        
        <View style={styles.mainContainer}>
          <ScrollView style={styles.container}>
            {/* Recommended Section */}
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <FlatList
              horizontal
              data={recommendedItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.productCard}>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <Text style={styles.productName}>{item.name}</Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />

            {/* Deals Section */}
            <Text style={styles.sectionTitle}>Super Deals</Text>
            <FlatList
              horizontal
              data={dealsItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dealCard} onPress={() => {
                  // Handle the press event for the deal item, e.g., navigate to product details
                  console.log(`Deal item ${item.name} pressed`);
                }}>
                  <Image source={{ uri: item.image }} style={styles.dealImage} />
                  <View style={styles.dealDetails}>
                    <Text style={styles.dealName}>{item.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.originalPrice}>S${item.originalPrice}</Text>
                      <Text style={styles.discountedPrice}>S${item.discountedPrice}</Text>
                    </View>
                    {item.discountPercentage && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discountPercentage}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
            
            {/* Add more content sections here */}
            
            {/* Extra padding at bottom for the button */}
            <View style={{ height: 100 }} />
          </ScrollView>
          
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

// Sample recommendations data
const recommendedItems = [
  { id: "1", name: "Checkered H&M Shirt", image: "https://pfst.cf2.poecdn.net/base/image/84623588901ca1f12d5bbc2fc3426defa41a363b407e7607e5802d472e795d77?w=800&h=800" },
  { id: "2", name: "Varsity Jacket", image: "https://pfst.cf2.poecdn.net/base/image/b166b1155fd21a4896628b92585029159f19f420888ca257b50436d1f24a15e5?w=1200&h=1600" },
  { id: "3", name: "Safety Boots", image: "https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225" },
  { id: "4", name: "Patchwork Shirt", image: "https://pfst.cf2.poecdn.net/base/image/7488cb6de00f7424a2d16af0dd0c5c471385a0cf5f1c5719e5588c0b3a2e7028?w=800&h=800" },
  { id: "5", name: "Green Henley Top", image: "https://pfst.cf2.poecdn.net/base/image/93705a0a2a2f14c22014694ae166328ee323c83d428b2eb493c5cb3de201ac98?w=768&h=768" },
];

// Sample deals data
const dealsItems = [
  { id: "d1", name: "Black Safety Boots", image: "https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225", originalPrice: "47.04", discountedPrice: "34.18", discountPercentage: "-36%" },
  { id: "d2", name: "Green Henley Top", image: "https://pfst.cf2.poecdn.net/base/image/93705a0a2a2f14c22014694ae166328ee323c83d428b2eb493c5cb3de201ac98?w=768&h=768", originalPrice: "22.20", discountedPrice: "16.10", discountPercentage: "-50%" },
  { id: "d3", name: "Patchwork Shirt", image: "https://pfst.cf2.poecdn.net/base/image/7488cb6de00f7424a2d16af0dd0c5c471385a0cf5f1c5719e5588c0b3a2e7028?w=800&h=800", originalPrice: "30.10", discountedPrice: "21.54", discountPercentage: "-30%" },
  { id: "d4", name: "Checkered Shirt", image: "https://pfst.cf2.poecdn.net/base/image/84623588901ca1f12d5bbc2fc3426defa41a363b407e7607e5802d472e795d77?w=800&h=800", originalPrice: "38.99", discountedPrice: "29.99", discountPercentage: "-23%" },
  { id: "d5", name: "Varsity Jacket", image: "https://pfst.cf2.poecdn.net/base/image/b166b1155fd21a4896628b92585029159f19f420888ca257b50436d1f24a15e5?w=1200&h=1600", originalPrice: "89.90", discountedPrice: "65.00", discountPercentage: "-28%" },
];

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
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginVertical: 10, 
    marginLeft: 15 
  },
  productCard: { 
    alignItems: "center", 
    marginHorizontal: 15 
  },
  productImage: { 
    width: 100, 
    height: 120, 
    borderRadius: 10 
  },
  productName: { 
    fontSize: 12, 
    marginTop: 5, 
    textAlign: "center", 
    color: "#0077b3", 
    width: 100 
  },
  // Styles for the deals section
  dealCard: {
    width: 160,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  dealImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  dealDetails: {
    padding: 10,
  },
  dealName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: 'gray',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  discountBadge: {
    backgroundColor: 'gold',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    position: 'absolute',
    top: -120,
    left: 1,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  // Floating button container to hold both button and label
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  // Floating action button styles
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0077b3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  // Label text below the button
  buttonLabel: {
    color: '#0077b3',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomepageScreen;