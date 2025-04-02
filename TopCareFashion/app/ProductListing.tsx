import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProductListingScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    color: '',
    size: '',
    condition: '',
    category: '',
    brand: ''
  });
  const [errors, setErrors] = useState({});

  // Predefined options
  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 
    'Footwear', 'Accessories', 'Others'
  ];
  
  const conditions = [
    'New with tags', 'Like new', 'Good', 'Fair', 'Poor'
  ];
  
  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'
  ];
  
  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Simulate image picker with a placeholder
  const pickImage = () => {
    // Placeholder URLs
    const sampleImages = [
      'https://pfst.cf2.poecdn.net/base/image/84623588901ca1f12d5bbc2fc3426defa41a363b407e7607e5802d472e795d77?w=800&h=800',
      'https://pfst.cf2.poecdn.net/base/image/b166b1155fd21a4896628b92585029159f19f420888ca257b50436d1f24a15e5?w=1200&h=1600',
      'https://pfst.cf2.poecdn.net/base/image/7488cb6de00f7424a2d16af0dd0c5c471385a0cf5f1c5719e5588c0b3a2e7028?w=800&h=800'
    ];
    
    // Just pick a random image from the sample list
    const randomIndex = Math.floor(Math.random() * sampleImages.length);
    setSelectedImage(sampleImages[randomIndex]);
    
    // Clear the image error if it exists
    if (errors.image) {
      setErrors({...errors, image: ''});
    }
  };

  // Handle form changes
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    
    // Clear error for this field if it exists
    if (errors[key]) {
      setErrors({...errors, [key]: ''});
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!form.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!form.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!form.condition) {
      newErrors.condition = 'Condition is required';
    }
    
    if (!form.size) {
      newErrors.size = 'Size is required';
    }
    
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!selectedImage) {
      newErrors.image = 'An image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success', 
        'Your product has been listed successfully!',
        [
          { 
            text: 'View My Listings', 
            onPress: () => router.push('/my-listings')
          },
          { 
            text: 'Continue Shopping', 
            onPress: () => router.push('/Homepage'),
            style: 'cancel'
          }
        ]
      );
    }, 1500);
  };

  // Unified dropdown component that works on all platforms
  const renderDropdown = (label, options, value, fieldName, errorMsg) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}<Text style={styles.required}>*</Text></Text>
        <TouchableOpacity 
          style={[
            styles.input,
            errorMsg ? styles.inputError : null
          ]}
          onPress={() => {
            Alert.alert(
              `Select ${label}`,
              '',
              [
                ...options.map(option => ({
                  text: option,
                  onPress: () => handleChange(fieldName, option)
                })),
                {
                  text: 'Cancel',
                  style: 'cancel'
                }
              ]
            );
          }}
        >
          <Text style={[styles.inputText, !value && styles.placeholderText]}>
            {value || `Select ${label.toLowerCase()}`}
          </Text>
        </TouchableOpacity>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
      
      {/* Simple header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Your Item</Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Product Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Product Image<Text style={styles.required}>*</Text>
          </Text>
          
          <View style={styles.imageSection}>
            {selectedImage ? (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="camera-outline" size={36} color="#0077b3" />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
          
          <Text style={styles.noteText}>
            Note: In the real app, you'll be able to upload your own images.
          </Text>
        </View>
        
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Product Title<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.name ? styles.inputError : null
              ]}
              placeholder="e.g. Men's Plaid Button-Down Shirt"
              placeholderTextColor="#aaaaaa"
              value={form.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Description<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textArea,
                errors.description ? styles.inputError : null
              ]}
              placeholder="Include details about material, fit, condition, etc."
              placeholderTextColor="#aaaaaa"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Price (S$)<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.price ? styles.inputError : null
              ]}
              placeholder="e.g. 25.00"
              placeholderTextColor="#aaaaaa"
              value={form.price}
              onChangeText={(text) => handleChange('price', text)}
              keyboardType="numeric"
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          {renderDropdown('Category', categories, form.category, 'category', errors.category)}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. H&M, Zara, Nike"
              placeholderTextColor="#aaaaaa"
              value={form.brand}
              onChangeText={(text) => handleChange('brand', text)}
            />
          </View>
        </View>
        
        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          
          {renderDropdown('Size', sizes, form.size, 'size', errors.size)}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Color</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Blue, Red, Multicolor"
              placeholderTextColor="#aaaaaa"
              value={form.color}
              onChangeText={(text) => handleChange('color', text)}
            />
          </View>
          
          {renderDropdown('Condition', conditions, form.condition, 'condition', errors.condition)}
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading ? styles.submitButtonDisabled : null
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>List Item for Sale</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0077b3',
  },
  header: {
    backgroundColor: '#0077b3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  rightHeaderPlaceholder: {
    width: 40, // For balance
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  required: {
    color: '#ff3b30',
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addImageButton: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0077b3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 16,
    color: '#0077b3',
    marginTop: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#aaaaaa',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#0077b3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductListingScreen;