import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminNavigationBar from './AdminNavigationBar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminFeedback = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('https://topcare-fashion-backend.onrender.com/api/testimonyRoutes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTestimonials(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={star <= rating ? '#FFD700' : '#ccc'}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  return (
  <SafeAreaView style={styles.safeContainer}>
    <AdminNavigationBar showBackButton={true} />
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Feedback</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testimonials</Text>

          {loading ? (
            <ActivityIndicator size="small" color="#0077b3" style={{ marginTop: 20 }} />
          ) : testimonials.length === 0 ? (
            <Text style={{ color: '#666', textAlign: 'center', marginTop: 10 }}>
              No feedback available.
            </Text>
          ) : (
            testimonials.map((testimonial) => (
              <View key={testimonial._id} style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <Image
                    source={{
                      uri: testimonial.user?.profileImage || 'https://via.placeholder.com/40',
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {testimonial.user?.username || 'Anonymous'}
                    </Text>
                    <Text style={styles.userLocation}>
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  {renderStars(testimonial.rating || 5)}
                </View>
                <Text style={styles.testimonialText}>
                  "{testimonial.message || 'No message provided.'}"
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0077b3',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#444',
  },
  testimonialCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginLeft: 2,
  },
  testimonialText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
});

export default AdminFeedback;
