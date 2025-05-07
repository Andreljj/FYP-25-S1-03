import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Simulated data store (replace with real API call in production)
const mockFeedbackData = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    topic: 'Order Issue',
    message: 'I never received my confirmation email.',
    submittedAt: '2025-04-20 14:23',
  },
  {
    id: '2',
    name: 'Mike Lee',
    email: 'mike@example.com',
    topic: 'Product Question',
    message: 'Is the black hoodie true to size?',
    submittedAt: '2025-04-20 09:11',
  },
];

const AdminFeedbackScreen = () => {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeedbackList(mockFeedbackData); // Replace with actual fetch
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <NavigationBar activeTab="Feedback" showBackButton />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>User Feedback</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0077b3" />
        ) : feedbackList.length === 0 ? (
          <Text style={styles.noFeedback}>No feedback received yet.</Text>
        ) : (
          feedbackList.map((feedback) => (
            <View key={feedback.id} style={styles.feedbackCard}>
              <View style={styles.header}>
                <Ionicons name="chatbubbles-outline" size={20} color="#0077b3" />
                <Text style={styles.topic}>{feedback.topic}</Text>
              </View>
              <Text style={styles.message}>"{feedback.message}"</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>From: {feedback.name} ({feedback.email})</Text>
                <Text style={styles.metaText}>Submitted: {feedback.submittedAt}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#0077b3' },
  container: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0077b3',
  },
  noFeedback: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  topic: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  meta: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#777',
  },
});

export default AdminFeedbackScreen;
