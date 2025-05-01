import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import NavigationBar from './NavigationBar';
import { useAuth } from './context/AuthContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ProfileScreen = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminAccess = () => {
    router.push('/ViewUserAccount');
  };
  
  const [profileData, setProfileData] = useState({
    username: 'Jason Gretel',
    email: '',
    bio: 'Fashion enthusiast',
    phone: '',
    address: '',
    gender: '',
    followers: 2263,
    following: 334,
    listings: 45
  });

  useEffect(() => {
    if (params?.profileUpdated === 'true') {
      setProfileData(prevData => ({
        ...prevData,
        username: params.username as string || prevData.username,
        email: params.email as string || prevData.email,
        bio: params.bio as string || prevData.bio,
        gender: params.gender as string || prevData.gender,
        // Add other fields as needed
      }));
    }
  }, [params]);

  const handleEditProfile = () => {
    router.push({
      pathname: '/EditProfile',
      params: {
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio,
        phone: profileData.phone,
        address: profileData.address,
        gender: profileData.gender
      }
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

// In the renderListings function, update the TouchableOpacity to include opacity for sold items
const renderListings = () => (
  <View style={styles.listingsContainer}>
    {yourListings.map((item) => (
      <TouchableOpacity 
        key={item.id} 
        style={[
          styles.listingCard,
          item.status === 'Sold' && { opacity: 0.5 }
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.listingImage} />
        <View style={styles.listingDetails}>
          <Text style={styles.listingName}>{item.name}</Text>
          <Text style={styles.listingPrice}>S${item.price}</Text>
          <View style={[
            styles.listingStatusBadge,
            item.status === 'Active' ? styles.statusActive : styles.statusSold
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

  const renderPurchased = () => (
    <View style={styles.listingsContainer}>
      {purchasedItems.map((item) => (
        <TouchableOpacity key={item.id} style={styles.listingCard}>
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
      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Image source={{ uri: review.userImage }} style={styles.reviewerImage} />
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerName}>{review.userName}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < review.rating ? "star" : "star-outline"}
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      ))}
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
                <TouchableOpacity onPress={handleImageUpload}>
                  <Image 
                    source={{ uri: profileImage }} 
                    style={styles.profileImage} 
                  />
                  <View style={styles.uploadIconContainer}>
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.headerRow}>
                  <Text style={styles.profileName}>{profileData.username}</Text>
                  <TouchableOpacity 
                    style={styles.settingsButton}
                    onPress={() => router.push('/AccountSettings')}
                  >
                    <Ionicons name="settings-outline" size={15} color="#0077b3" />
                    <Text style={styles.settingsButtonText}>Settings</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{profileData.followers}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{profileData.following}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{profileData.listings}</Text>
                    <Text style={styles.statLabel}>Listings</Text>
                  </View>
                </View>
                <Text style={styles.profileBio}>{profileData.bio}</Text>
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
                <TouchableOpacity 
                  style={[styles.followButton, isFollowing && styles.followingButton]} 
                  onPress={handleFollow}
                >
                  <Text style={styles.followButtonText}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
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
              style={[styles.tab, activeTab === 'purchased' && styles.activeTab]}
              onPress={() => setActiveTab('purchased')}
            >
              <Ionicons 
                name="cart-outline" 
                size={24} 
                color={activeTab === 'purchased' ? '#0077b3' : '#666'} 
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, activeTab === 'purchased' && styles.activeTabLabel]}>
                Purchased
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

          <ScrollView style={styles.container}>
            {activeTab === 'listings' && renderListings()}
            {activeTab === 'purchased' && renderPurchased()}
            {activeTab === 'reviews' && renderReviews()}

            <TouchableOpacity 
              style={styles.adminButton}
              onPress={handleAdminAccess}
            >
              <Text style={styles.adminButtonText}>Continue as Admin</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const purchasedItems = [
  { 
    id: '1', 
    name: 'Casual Printed Shirt', 
    price: '29.50', 
    purchaseDate: '2024-01-15',
    image: 'https://images.meesho.com/images/products/432703926/5c98a_256.webp'
  },
  { 
    id: '2', 
    name: 'Leather Boots', 
    price: '34.00', 
    purchaseDate: '2024-01-10',
    image: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225'
  }
];

const reviews = [
  {
    id: '1',
    userName: 'Sarah Lee',
    userImage: 'https://www.forthwithlife.co.uk/wp-content/uploads/2020/12/female-health.jpg',
    date: '2 days ago',
    text: 'Great seller! Item was exactly as described and shipping was fast.',
    rating: 5,
  },
  {
    id: '2',
    userName: 'Mike Johnson',
    userImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf_ae5HuWfmU6HuzG41riE53P27TzuGTOoQA&s',
    date: '1 week ago',
    text: 'Good communication and item quality. Would buy again!',
    rating: 4,
  },
];

const yourListings = [
  { 
    id: '1', 
    name: 'Checkered Shirt', 
    price: '29.99', 
    status: 'Active', 
    image: 'https://pfst.cf2.poecdn.net/base/image/84623588901ca1f12d5bbc2fc3426defa41a363b407e7607e5802d472e795d77?w=800&h=800'
  },
  { 
    id: '2', 
    name: 'Varsity Jacket', 
    price: '65.00', 
    status: 'Sold', 
    image: 'https://pfst.cf2.poecdn.net/base/image/b166b1155fd21a4896628b92585029159f19f420888ca257b50436d1f24a15e5?w=1200&h=1600'
  },
  { 
    id: '3', 
    name: 'Safety Boots', 
    price: '59.60', 
    status: 'Active', 
    image: 'https://pfst.cf2.poecdn.net/base/image/b7df18a7d27dbd3c5758ed5f96aa5482f1839dc7818c3b95efbd1138f2e58755?w=225&h=225'
  },
  { 
    id: '4', 
    name: 'Denim Jeans', 
    price: '45.99', 
    status: 'Active', 
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnaCNvloZVlw1H-MTeqKIlbxtE34anKPfRnQ&s'
  },
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
  uploadIconContainer: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: '#666',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    left: 30,
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
  followButton: {
    backgroundColor: '#0077b3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  followingButton: {
    backgroundColor: '#666',
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  listingCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listingImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  listingDetails: {
    padding: 10,
  },
  listingName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
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
    fontWeight: '500',
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
});

export default ProfileScreen;