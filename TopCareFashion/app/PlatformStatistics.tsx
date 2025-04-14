// components/PlatformStatistics.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlatformStatistics = () => {
  // In a real app, these would come from an API
  const stats = {
    activeUsers: 3254,
    dailyLogins: 1876,
    totalListings: 18429,
    successfulTrades: 7543
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Fashion Footprint</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={24} color="#0077b3" />
          <Text style={styles.statNumber}>{stats.activeUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="log-in" size={24} color="#0077b3" />
          <Text style={styles.statNumber}>{stats.dailyLogins.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Daily Logins</Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="shirt" size={24} color="#0077b3" />
          <Text style={styles.statNumber}>{stats.totalListings.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Listings</Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={24} color="#0077b3" />
          <Text style={styles.statNumber}>{stats.successfulTrades.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Successful Trades</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077b3',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  }
});

export default PlatformStatistics;