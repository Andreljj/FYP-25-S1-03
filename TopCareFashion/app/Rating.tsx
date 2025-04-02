import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Star rating component
const StarRating = ({ rating, setRating, size = 40 }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
        >
          <Ionicons 
            name={rating >= star ? "star" : "star-outline"} 
            size={size} 
            color={rating >= star ? "#FFD700" : "#ccc"} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Category option component for both web and mobile
const CategoryOption = ({ id, label, icon, selected, onSelect }) => (
  <TouchableOpacity 
    style={[
      styles.categoryOption,
      selected === id && styles.categoryOptionSelected
    ]}
    onPress={() => onSelect(id)}
  >
    <Ionicons 
      name={icon} 
      size={24} 
      color={selected === id ? '#0077b3' : '#666'} 
      style={styles.categoryIcon}
    />
    <Text style={[
      styles.categoryText,
      selected === id && styles.categoryTextSelected
    ]}>
      {label}
    </Text>
    {selected === id && (
      <Ionicons name="checkmark-circle" size={20} color="#0077b3" style={styles.checkIcon} />
    )}
  </TouchableOpacity>
);

export default function RatingScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(4);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Categories with icons
  const categories = [
    { id: 'product_quality', label: 'Product Quality', icon: 'cube-outline' },
    { id: 'shopping_experience', label: 'Shopping Experience', icon: 'cart-outline' },
    { id: 'customer_service', label: 'Customer Service', icon: 'people-outline' },
    { id: 'shipping', label: 'Shipping & Delivery', icon: 'time-outline' }
  ];

  const getRatingText = () => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!category) {
      newErrors.category = "Please select a category";
    }
    
    if (!description.trim()) {
      newErrors.description = "Please provide review details";
    } else if (description.trim().length < 10) {
      newErrors.description = "Review should be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    if (errors.category) {
      setErrors(prev => ({...prev, category: null}));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Review submitted:', {
        rating,
        description,
        category,
      });
      
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Navigate back after showing success
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1000);
  };

  const handleBack = () => {
    router.back();
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Submitted</Text>
          <View style={styles.rightHeaderPlaceholder} />
        </View>
        
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successText}>
            Your review has been submitted successfully. We appreciate your feedback!
          </Text>
          <Text style={styles.redirectingText}>Redirecting to homepage...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Overall Rating</Text>
              <Text style={styles.ratingLabel}>How would you rate your experience?</Text>
              
              <View style={styles.ratingBox}>
                <StarRating 
                  rating={rating} 
                  setRating={setRating} 
                  size={isWeb ? 50 : 40} 
                />
                <Text style={styles.ratingText}>{getRatingText()}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>What are you reviewing?</Text>
              <Text style={styles.sectionSubtitle}>Select the category that best describes your feedback</Text>
              
              <View style={styles.categoriesContainer}>
                {categories.map((cat) => (
                  <CategoryOption
                    key={cat.id}
                    id={cat.id}
                    label={cat.label}
                    icon={cat.icon}
                    selected={category}
                    onSelect={handleCategoryChange}
                  />
                ))}
              </View>
              
              {errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Review Details</Text>
              <Text style={styles.sectionSubtitle}>Tell us more about your experience</Text>
              
              <TextInput
                style={styles.textInput}
                placeholder="What did you like or dislike? What did you use this product for? Would you recommend it to others?"
                multiline
                placeholderTextColor="#aaaaaa"
                numberOfLines={8}
                textAlignVertical="top"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description && text.trim().length >= 10) {
                    setErrors(prev => ({...prev, description: null}));
                  }
                }}
              />
              
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
              
              <Text style={styles.characterCount}>
                {description.length} characters {description.length < 10 ? "(minimum 10)" : ""}
              </Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                (isSubmitting || !category || description.length < 10) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || !category || description.length < 10}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="white" style={styles.submitIcon} />
                  <Text style={styles.submitText}>Submit Review</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleBack}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0077b3',
  },
  customHeader: {
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
  backButton: {
    padding: 8,
  },
  rightHeaderPlaceholder: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    maxWidth: isWeb ? 600 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 15,
    color: '#666',
    marginBottom: 15,
  },
  ratingBox: {
    alignItems: 'center',
    padding: 10,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 5,
  },
  categoriesContainer: {
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: isWeb ? 'wrap' : 'nowrap',
    marginBottom: 5,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
    marginRight: isWeb ? 10 : 0,
    backgroundColor: '#f9f9f9',
    width: isWeb ? 'calc(50% - 5px)' : '100%',
  },
  categoryOptionSelected: {
    borderColor: '#0077b3',
    backgroundColor: 'rgba(0, 119, 179, 0.05)',
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  categoryTextSelected: {
    color: '#0077b3',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 5,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 15,
    minHeight: 150,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#0077b3',
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#8bc4df',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  redirectingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 20,
  },
});