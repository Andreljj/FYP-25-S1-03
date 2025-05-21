import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AdminNavigationBar from './AdminNavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditFAQ = () => {
  const router = useRouter();
  const [faqs, setFaqs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [queries, setQueries] = useState([]);

  const loadQueries = async () => {
    try {
      const queriesData = await AsyncStorage.getItem('faqQueries') || '[]';
      setQueries(JSON.parse(queriesData));
    } catch (error) {
      console.error('Error loading queries:', error);
    }
  };

  const fetchAllFaqs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('https://topcare-fashion-backend.onrender.com/api/faq', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch FAQs');
      }

      const data = await res.json();
      const normalizedFaqs = data.map(faq => ({
        id: faq._id,
        question: faq.question,
        answer: faq.answer
      }));
      setFaqs(normalizedFaqs);
    } catch (err) {
      console.error('Error loading FAQs:', err);
      Alert.alert('Error', 'Unable to load FAQs from server');
    }
  };

  useEffect(() => {
    fetchAllFaqs();
    loadQueries();
  }, []);

  const handleCreateFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      Alert.alert('Error', 'Please enter both a question and an answer.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('https://topcare-fashion-backend.onrender.com/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: newQuestion.trim(),
          answer: newAnswer.trim()
        }),
      });

      if (!res.ok) {
        Alert.alert('Error', 'Failed to create FAQ');
        return;
      }

      await fetchAllFaqs();
      setNewQuestion('');
      setNewAnswer('');
      Alert.alert('Success', 'FAQ created successfully!');
    } catch (error) {
      console.error('Create FAQ error:', error);
      Alert.alert('Error', 'An error occurred while creating FAQ');
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
  };

  const handleSave = async (id) => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      Alert.alert('Error', 'Both question and answer are required');
      return;
    }

    const token = await AsyncStorage.getItem('token');

    const isNew = id.startsWith('temp-');

    const endpoint = isNew
      ? 'https://topcare-fashion-backend.onrender.com/api/faq'
      : `https://topcare-fashion-backend.onrender.com/api/faq/${id}`;

    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: newQuestion.trim(),
        answer: newAnswer.trim()
      }),
    });

    if (!res.ok) {
      Alert.alert("Error", "Failed to save FAQ");
      return;
    }

    await fetchAllFaqs();

    setEditingId(null);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete FAQ',
      'Are you sure you want to delete this FAQ?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await fetch(`https://topcare-fashion-backend.onrender.com/api/faq/${id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!res.ok) {
                Alert.alert('Error', 'Failed to delete FAQ');
                return;
              }

              await fetchAllFaqs();
            } catch (err) {
              console.error('Error deleting FAQ:', err);
              Alert.alert('Error', 'Failed to delete FAQ');
            }
          }
        }
      ]
    );
  };

  const handleDeleteQuery = async (queryId) => {
    Alert.alert(
      'Delete Query',
      'Are you sure you want to delete this query?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const queriesData = await AsyncStorage.getItem('faqQueries') || '[]';
              const currentQueries = JSON.parse(queriesData);
              const updatedQueries = currentQueries.filter(q => q.id !== queryId);
              await AsyncStorage.setItem('faqQueries', JSON.stringify(updatedQueries));
              setQueries(updatedQueries);
            } catch (error) {
              console.error('Error deleting query:', error);
              Alert.alert('Error', 'Failed to delete query');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <AdminNavigationBar showBackButton={true} />

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit FAQs</Text>
        </View>

        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            {editingId === faq.id ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={newQuestion}
                  onChangeText={setNewQuestion}
                  placeholder="Question"
                />
                <TextInput
                  style={[styles.editInput, styles.answerInput]}
                  value={newAnswer}
                  onChangeText={setNewAnswer}
                  placeholder="Answer"
                  multiline
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSave(faq.id)}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditingId(null)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.questionText}>{faq.question}</Text>
                <Text style={styles.answerText}>{faq.answer}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(faq)}
                  >
                    <Ionicons name="create-outline" size={20} color="#0077b3" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(faq.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))}

        <View style={{ padding: 15 }}>
          <Text style={styles.sectionTitle}>Create New FAQ</Text>
          <TextInput
            style={styles.editInput}
            value={newQuestion}
            onChangeText={setNewQuestion}
            placeholder="Enter question"
          />
          <TextInput
            style={[styles.editInput, styles.answerInput]}
            value={newAnswer}
            onChangeText={setNewAnswer}
            placeholder="Enter answer"
            multiline
          />
          <TouchableOpacity
            style={[styles.saveButton, { alignSelf: 'flex-end', marginTop: 10 }]}
            onPress={handleCreateFaq}
          >
            <Text style={styles.buttonText}>Create FAQ</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 15 }}>
          <Text style={styles.sectionTitle}>User Queries</Text>
          {queries.map((query) => (
            <View key={query.id} style={styles.faqItem}>
              <Text style={styles.questionText}>{query.topic}</Text>
              <Text style={styles.answerText}>{query.message}</Text>
              <Text style={styles.answerText}>From: {query.name} ({query.email})</Text>
              <Text style={styles.answerText}>Submitted: {new Date(query.timestamp).toLocaleString()}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setNewQuestion(query.topic);
                    setNewAnswer(query.message);
                  }}
                >
                  <Text style={styles.buttonText}>Use in FAQ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteQuery(query.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: "#0077b3" 
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f8f8f8" 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0077b3"
  },
  addButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  faqItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 15
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333'
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  answerInput: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5
  },
  editButton: {
    marginRight: 15
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  saveButton: {
    backgroundColor: '#0077b3',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: '500'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077b3',
    marginBottom: 15,
  }
});

export default EditFAQ;
