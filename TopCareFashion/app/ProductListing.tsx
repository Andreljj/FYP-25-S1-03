// app/ProductListing.tsx
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
  StatusBar,
  Modal,
  FlatList,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const ProductListingScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]); // Array to store multiple images
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    color: '',
    size: '',
    condition: '',
    category: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});
  
  // Modal states for dropdowns
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);

  // Predefined options
  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 
    'Footwear'
  ];
  
  const conditions = [
    'New with tags', 'Like new', 'Excellent', 'Good', 'Fair', 'Poor'
  ];
  
  const clothingSizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'
  ];
  
  // Numerical footwear sizes
  const footwearSizes = [
    '35', '36', '37', '38', '39', '40', '41', '42', 
    '43', '44', '45', '46', '47', '48'
  ];
  
  const genders = [
    'Men', 'Women', 'Unisex'
  ];
  
  const colors = [
    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
    'Pink', 'Purple', 'Brown', 'Gray', 'Beige', 'Multicolor'
  ];

  // Request permission for camera roll
  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images.');
        }
      }
    })();
  }, []);
  
  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Get size options based on category
  const getSizeOptions = () => {
    return form.category === 'Footwear' ? footwearSizes : clothingSizes;
  };

  // Image picker function
  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Maximum Images", "You can only upload up to 5 images");
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
        
        // Clear the image error if it exists
        if (errors.images) {
          setErrors({...errors, images: ''});
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'There was a problem selecting the image.');
    }
  };

  // Remove an image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Handle form changes
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    
    // Clear error for this field if it exists
    if (errors[key]) {
      setErrors({...errors, [key]: ''});
    }
    
    // Reset size when category changes
    if (key === 'category') {
      setForm(prev => ({ ...prev, size: '' }));
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
    
    if (!form.color) {
      newErrors.color = 'Color is required';
    }
    
    if (!form.size) {
      newErrors.size = 'Size is required';
    }
    
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
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

  // Create a custom Dropdown component
  const Dropdown = ({label, value, onPress, required, error}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label}{required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.input, error ? styles.inputError : null]}
        onPress={onPress}
      >
        <View style={styles.dropdownContent}>
          <Text style={[
            styles.inputText,
            !value && styles.placeholderText
          ]}>
            {value || `Select ${label.toLowerCase()}`}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#777" />
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List Your Item</Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Product Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Product Images<Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Upload up to 5 images of your item
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
            {/* Image previews */}
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Add image button (if less than 5 images) */}
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="camera-outline" size={36} color="#0077b3" />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          
          {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          
          <Text style={styles.imageCountText}>
            {images.length}/5 images
          </Text>
        </View>
        
        {/* Category, Condition, and Color (positioned at top) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Classification</Text>
          
          {/* Category dropdown */}
          <Dropdown
            label="Category"
            value={form.category}
            onPress={() => setShowCategoryModal(true)}
            required={true}
            error={errors.category}
          />
          
          {/* Condition dropdown */}
          <Dropdown
            label="Condition"
            value={form.condition}
            onPress={() => setShowConditionModal(true)}
            required={true}
            error={errors.condition}
          />
          
          {/* Color dropdown */}
          <Dropdown
            label="Color"
            value={form.color}
            onPress={() => setShowColorModal(true)}
            required={true}
            error={errors.color}
          />
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
        </View>
        
        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          
          {/* Size dropdown */}
          <Dropdown
            label={form.category === 'Footwear' ? 'Shoe Size' : 'Size'}
            value={form.size}
            onPress={() => setShowSizeModal(true)}
            required={true}
            error={errors.size}
          />
          
          {/* Gender dropdown */}
          <Dropdown
            label="Gender"
            value={form.gender}
            onPress={() => setShowGenderModal(true)}
            required={false}
            error={errors.gender}
          />
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
      
      {/* Modal for Category dropdown */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('category', item);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {form.category === item && (
                    <Ionicons name="checkmark" size={22} color="#0077b3" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {/* Modal for Condition dropdown */}
      <Modal
        visible={showConditionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConditionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Condition</Text>
              <TouchableOpacity onPress={() => setShowConditionModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={conditions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('condition', item);
                    setShowConditionModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {form.condition === item && (
                    <Ionicons name="checkmark" size={22} color="#0077b3" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {/* Modal for Color dropdown */}
      <Modal
        visible={showColorModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowColorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Color</Text>
              <TouchableOpacity onPress={() => setShowColorModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={colors}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('color', item);
                    setShowColorModal(false);
                  }}
                >
                  <View style={styles.colorItemContainer}>
                    <View 
                      style={[
                        styles.colorSwatch, 
                        { backgroundColor: item.toLowerCase() === 'multicolor' 
                          ? 'transparent' 
                          : item.toLowerCase() }
                      ]}
                    >
                      {item.toLowerCase() === 'multicolor' && (
                        <View style={styles.multicolorSwatch} />
                      )}
                    </View>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </View>
                  
                  {form.color === item && (
                    <Ionicons name="checkmark" size={22} color="#0077b3" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {/* Modal for Size dropdown */}
      <Modal
        visible={showSizeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSizeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {form.category === 'Footwear' ? 'Select Shoe Size' : 'Select Size'}
              </Text>
              <TouchableOpacity onPress={() => setShowSizeModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={getSizeOptions()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('size', item);
                    setShowSizeModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {form.size === item && (
                    <Ionicons name="checkmark" size={22} color="#0077b3" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {/* Modal for Gender dropdown */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={genders}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('gender', item);
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {form.gender === item && (
                    <Ionicons name="checkmark" size={22} color="#0077b3" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  required: {
    color: '#ff3b30',
  },
  imageScrollView: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0077b3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addImageText: {
    fontSize: 12,
    color: '#0077b3',
    marginTop: 5,
  },
  imageCountText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
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
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  // Color swatch styles
  colorItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  multicolorSwatch: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 0,
    // Create a multicolor gradient effect
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderStyle: 'solid',
    borderTopColor: 'red',
    borderRightColor: 'blue',
    borderBottomColor: 'green',
    borderLeftColor: 'yellow',
    borderWidth: 6,
  },
});

export default ProductListingScreen;