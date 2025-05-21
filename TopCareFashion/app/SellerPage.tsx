import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import NavigationBar from './NavigationBar';
import { useAuth } from './context/AuthContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SellerPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [activeTab, setActiveTab] = useState('listings');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  
  const [profileData, setProfileData] = useState({
    _id: '',
    username: '',
    bio: '',
    email: '',
    phone: '',
    address: '',
    gender: ''
  });
  const [reviews, setReviews] = useState([]);
  const { sellerId } = useLocalSearchParams(); 
  console.log("🟦 SellerPage loaded with sellerId:", sellerId);



  

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change profile picture.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets[0].uri) {
        setProfileImage(result.assets[0].uri);
        
        // Save to AsyncStorage for persistence
        try {
          await AsyncStorage.setItem('profileImage', result.assets[0].uri);
        } catch (error) {
          console.error('Error saving profile image:', error);
        }
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    }
  };


  // Initialize empty listings array instead of using dummy data
  const [yourListings, setYourListings] = useState([]);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Token:", token);
      // Fix the URL string template syntax
      const response = await fetch(`https://topcare-fashion-backend.onrender.com/api/user/seller/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend returned error page or HTML:", errorText);
      return;
      }
      const data = await response.json();
      console.log("Data from backend:", data);
      const { user } = data;
  
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "",
        _id: user._id || ""  // Make sure to set the _id
      });
  
      setProfileImage(user.profileImage || 'https://via.placeholder.com/150');
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  // Modify the fetchReviews function to include better error handling
  const fetchReviews = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // Use the sellerId from useLocalSearchParams directly
      if (!sellerId) {
        console.log("No seller ID available yet");
        return;
      }
  
      console.log("Fetching reviews for seller:", sellerId);
      
      const response = await fetch(`https://topcare-fashion-backend.onrender.com/api/reviews/seller/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("Review fetch error:", errText);
        throw new Error(`Failed to fetch reviews: ${response.status} ${errText}`);
      }
  
      const data = await response.json();
      console.log("Reviews received:", data);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message);
      Alert.alert(
        "Error",
        "Failed to load reviews. Please try again later."
      );
    }
  }, [sellerId]); // Update dependency to use sellerId directly

  // Update the useEffect to call fetchReviews immediately
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  

  useEffect(() => {
    if (profileData._id) {
      fetchReviews();
    }
  }, [profileData._id, fetchReviews]); // Add fetchReviews to dependencies

  // Add this useEffect to fetch profile data when component mounts
  useEffect(() => {
    fetchProfile();
  }, []);
  
  
  
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("Fetching listings for seller:", sellerId);
        
        const response = await fetch(`https://topcare-fashion-backend.onrender.com/api/user/seller/public/${sellerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch listings:", errorText);
          return;
        }
  
        const data = await response.json();
        console.log("Received listings:", data);
        setYourListings(data.listings);
        console.log("🟩 Listings received:", yourListings);


      } catch (error) {
        console.error('Error fetching user listings:', error);
      }
    };
  
    if (sellerId) {
      fetchUserListings();
    }
  }, [sellerId]);


  // Modify the useEffect for new listings to also save to storage
  useEffect(() => {
    if (params?.listingAdded === 'true' && params?.newListing) {
      try {
        const newListing = JSON.parse(params.newListing);
        setYourListings(prevListings => {
          const exists = prevListings.some(listing => listing._id === newListing.id);
          if (exists) return prevListings;
          
          const updatedListings = [{
            id: newListing.id,
            name: newListing.name,
            price: newListing.price,
            image: newListing.image,
            status: 'active',
            description: newListing.description,
            category: newListing.category,
            condition: newListing.condition
          }, ...prevListings];
          
          // Save to AsyncStorage
          AsyncStorage.setItem('userListings', JSON.stringify(updatedListings));
          return updatedListings;
        });
      } catch (error) {
        console.error('Error parsing new listing:', error);
      }
    }
  }, [params]);

  const [showOptionsModal, setShowOptionsModal] = useState(null);


  const renderListings = () => (
    <FlatList
      data={yourListings}
      numColumns={2}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.listingsContainer}
      renderItem={({ item }) => (
        <View style={styles.listingWrapper}>
          {/* Listing Card */}
          <TouchableOpacity
            style={[
              styles.listingCard,
              item.status === 'sold' && { opacity: 0.5 },
            ]}
            onPress={() => {
              if (item.status !== 'sold') {
                router.push({
                  pathname: '/product/ListingDetails',
                  params: { id: item._id },
                });
              }
            }}
          >
            <Image source={{ uri: item.image }} style={styles.listingImage} />
            <View style={styles.listingDetails}>
              <Text style={styles.listingName}>{item.title || item.name}</Text>
              <Text style={styles.listingPrice}>S${item.price}</Text>
              <View
                style={[
                  styles.listingStatusBadge,
                  item.status === 'active'
                    ? styles.statusActive
                    : styles.statusSold,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
  
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyStateContainer}>
          <Ionicons name="cube-outline" size={48} color="#999" />
          <Text style={styles.emptyStateText}>No listings yet</Text>
          <TouchableOpacity
            style={styles.createListingButton}
            onPress={() => router.push('/ProductListing')}
          >
            <Text style={styles.createListingButtonText}>Create Your First Listing</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
  
  

  const renderPurchased = () => (
    <View style={styles.listingsContainer}>
      {purchasedItems.map((item) => (
        <TouchableOpacity key={item._id} style={styles.listingCard}>
          <Image source={{ uri: item.image }} style={styles.listingImage} />
          <View style={styles.listingDetails}>
            <Text style={styles.listingName}>{item.name}</Text>
            <Text style={styles.listingPrice}>S${item.price}</Text>
            <Text style={styles.purchaseDate}>Purchased on {item.purchaseDate}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.reviewsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>User Reviews</Text>
      </View>
  
      {reviews.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888' }}>No reviews yet</Text>
      ) : (
        reviews.map((review) => (
          <View key={review._id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <TouchableOpacity 
                style={styles.reviewUser}
                onPress={() => {
                  if (review.buyer?._id) {
                    router.push({
                      pathname: '/SellerPage',
                      params: { sellerId: review.buyer._id }
                    });
                  }
                }}
              >
                <Image
                  source={{ uri: review.buyer?.profileImage || 'https://via.placeholder.com/36' }}
                  style={styles.reviewUserAvatar}
                />
                <View>
                  <Text style={styles.reviewUserName}>{review.buyer?.username || 'Anonymous'}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.reviewStarsContainer}>
                {[...Array(5)].map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < review.rating ? 'star' : 'star-outline'}
                    size={14}
                    color={index < review.rating ? '#FFD700' : '#ccc'}
                    style={styles.reviewStarIcon}
                  />
                ))}
              </View>
            </View>
  
            <View style={styles.reviewContent}>
              <Image
                source={{ uri: review.listing?.image || 'https://via.placeholder.com/70' }}
                style={styles.reviewProductImage}
              />
              <View style={styles.reviewTextContainer}>
                <Text style={styles.reviewProductName}>{review.listing?.title}</Text>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
  
  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077b3" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeContainer}>
        <NavigationBar activeTab="PROFILE" />
        <View style={styles.mainContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.profileContent}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: profileImage }} 
                  style={styles.profileImage} 
                />
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.headerRow}>
                  <Text style={styles.profileName}>{profileData.username || 'Your Name'}</Text>
                </View>                
                <Text style={styles.profileBio}>{profileData.bio || 'Fashion Enthusiast'}</Text>
                <Text style={styles.profileEmail}>{profileData.email || 'youremail@example.com'}</Text>
                {profileData.phone && (
                  <Text style={styles.profileDetail}>
                    <Ionicons name="call-outline" size={16} color="#666" style={styles.detailIcon} />
                    {profileData.phone}
                  </Text>
                )}
                {profileData.address && (
                  <Text style={styles.profileDetail}>
                    <Ionicons name="location-outline" size={16} color="#666" style={styles.detailIcon} />
                    {profileData.address}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'listings' && styles.activeTab]}
              onPress={() => setActiveTab('listings')}
            >
              <Ionicons 
                name="grid-outline" 
                size={24} 
                color={activeTab === 'listings' ? '#0077b3' : '#666'} 
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, activeTab === 'listings' && styles.activeTabLabel]}>
                Listings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
              onPress={() => setActiveTab('reviews')}
            >
              <Ionicons 
                name="star-outline" 
                size={24} 
                color={activeTab === 'reviews' ? '#0077b3' : '#666'} 
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, activeTab === 'reviews' && styles.activeTabLabel]}>
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'listings' ? renderListings() : (
            <ScrollView style={styles.container}>
              {renderReviews()}
            </ScrollView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    padding: 20,
    backgroundColor: 'white',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfo: {
    flex: 1,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    color: '#666',
    fontSize: 14,
  },
  detailIcon: {
    marginRight: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingRight: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077b3',
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0077b3',
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#0077b3',
  },
  listingsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  listingWrapper: {
    flex: 1,
    margin: 5,
    position: 'relative', // VERY IMPORTANT
  },
  listingCard: {
    width: Dimensions.get('window').width * 0.44,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 0,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative', // Add this for absolute positioning
  },
  listingImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  listingDetails: {
    padding: 10,
    flex: 1, // Add flex to ensure content fills space
  },
  listingName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 15,
    color: '#0077b3',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listingStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusSold: {
    backgroundColor: '#666',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    alignSelf:'center'
  },
  purchaseDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  reviewsContainer: {
    padding: 15,
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  adminButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 20,
    width: '90%',  // Make button wider
    elevation: 3,  // Add shadow for Android
    shadowColor: '#000',  // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  adminButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,    
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 20,
    marginTop: -5,
  },
  settingsButtonText: {
    color: '#0077b3',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.1, // Adjust this value as needed
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  createListingButton: {
    backgroundColor: '#0077b3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  createListingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
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
    marginTop: 10,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

});

export default SellerPage;
