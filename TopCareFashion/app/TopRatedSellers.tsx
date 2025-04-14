// components/TopRatedSellers.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <View style={styles.starContainer}>
      {[...Array(5)].map((_, i) => (
        <Ionicons 
          key={i} 
          name={i < Math.floor(rating) ? "star" : i < rating ? "star-half" : "star-outline"} 
          size={16} 
          color="#FFD700" 
          style={styles.starIcon}
        />
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const TopRatedSellers = () => {
  const router = useRouter();
  
  // Sample data - in a real app, this would come from an API
  const topSellers = [
    {
      id: "s1",
      username: "vintage_vibes",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
      items: 34,
      reviewCount: 126
    },
    {
      id: "s2",
      username: "fashionista22",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4.8,
      items: 56,
      reviewCount: 203
    },
    {
      id: "s3",
      username: "urban_threads",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.7,
      items: 28,
      reviewCount: 94
    },
    {
      id: "s4",
      username: "eco_closet",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
      rating: 4.9,
      items: 41,
      reviewCount: 158
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Top Rated Sellers</Text>
        <TouchableOpacity onPress={() => router.push('/sellers')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={topSellers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.sellerCard}
            onPress={() => router.push(`/seller/${item.id}`)}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>@{item.username}</Text>
            <StarRating rating={item.rating} />
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>{item.items} items</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{item.reviewCount} reviews</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Profile</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#0077b3',
    fontWeight: '500',
    fontSize: 14,
  },
  list: {
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 5,
  },
  sellerCard: {
    backgroundColor: 'white',
    width: 180,
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#777',
  },
  metaDot: {
    fontSize: 12,
    color: '#777',
    marginHorizontal: 5,
  },
  viewButton: {
    backgroundColor: '#0077b3',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  }
});

export default TopRatedSellers;