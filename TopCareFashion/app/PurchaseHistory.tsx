import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PurchaseHistoryScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth(); // Ensure `user.token` is available
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Review modal state
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [currentReviewOrder, setCurrentReviewOrder] = useState(null);

  // Handle authentication check separately from data loading
  useEffect(() => {
    // Set initialized to true after first render
    setInitialized(true);
  }, []);

  // Check authentication status after component is mounted
  useEffect(() => {
    // Only run this effect after component is fully initialized
    if (initialized && !isAuthenticated) {
      // Now it's safe to navigate
      setTimeout(() => {
        router.replace('/Login');
      }, 0);
    }
  }, [initialized, isAuthenticated]);

  // Load purchase history when component mounts
  useEffect(() => {
    const loadPurchaseHistory = async () => {
      try {
        setLoading(true);

        // Attempt to load purchase history from AsyncStorage
        const storedHistory = await AsyncStorage.getItem('userOrders');
        if (storedHistory) {
          setPurchaseHistory(JSON.parse(storedHistory)); // Load saved state from AsyncStorage
          setLoading(false); // Stop loading while we wait for backend
        }

        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('You must be logged in to view your purchase history.');
        }

        // Fetch the latest data from the backend
        const response = await fetch('https://topcare-fashion-backend.onrender.com/api/purchases/my', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch purchase history.');
        }

        const data = await response.json();

        // Map backend data to the frontend structure
        const formattedPurchases = data.map((order: any) => ({
          id: order._id,
          orderNumber: order._id,
          userId: order.user,
          orderDate: order.createdAt ? new Date(order.createdAt) : null,
          deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : null,
          totalAmount: order.totalAmount,
          paymentMethod: 'Credit Card',
          status: order.status || 'Processing',
          items: order.items.map((item: any) => ({
            id: item._id,
            listingId: item.listing,
            name: item.listing.title || 'Unknown Item',
            image: item.listing.image || '',
            price: item.listing.price || 0,
            quantity: item.quantity,
            reviewed: item.reviewed || false, // Ensure backend provides this field
            reviewText: item.reviewText || '',
            reviewRating: item.reviewRating || 0,
          })),
        }));

        // Update state and persist to AsyncStorage
        setPurchaseHistory(formattedPurchases);
        await AsyncStorage.setItem('userOrders', JSON.stringify(formattedPurchases));
      } catch (error) {
        console.error('Error loading purchase history:', error);
        Alert.alert('Error', error.message || 'Failed to load purchase history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadPurchaseHistory();
    }
  }, [isAuthenticated, user]);

  // Function to open review modal
  const openReviewModal = (order, item) => {
    setCurrentReviewOrder(order);
    setCurrentReviewItem(item);
    setReviewText('');
    setReviewRating(5);
    setReviewModalVisible(true);
  };

  // Function to submit a review
  const submitReview = async () => {
    if (!reviewText.trim()) {
      Alert.alert('Review Required', 'Please enter a review before submitting.');
      return;
    }

    try {
      setLoading(true);

      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to submit a review.');
      }

      // Prepare the review payload
      const reviewPayload = {
        listingId: currentReviewItem.listingId, // Use "listingId" instead of "itemId"
        rating: reviewRating,
        comment: reviewText.trim(), // Use "comment" instead of "reviewText"
      };

      // Make the API call
      const response = await fetch('https://topcare-fashion-backend.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to submit review.');
      }

      // Update the item's reviewed status and order status in the purchase history
      const updatedHistory = purchaseHistory.map((order) => {
        if (order.id === currentReviewOrder.id) {
          const updatedItems = order.items.map((item) =>
            item.id === currentReviewItem.id
              ? { ...item, reviewed: true, reviewText, reviewRating }
              : item
          );

          // Change the order status to "Completed" if all items are reviewed
          const isAllReviewed = updatedItems.every((item) => item.reviewed);
          return { ...order, items: updatedItems, status: isAllReviewed ? 'Completed' : order.status };
        }
        return order;
      });

      // Persist updated history to AsyncStorage
      await AsyncStorage.setItem('userOrders', JSON.stringify(updatedHistory)); // Save updated state
      setPurchaseHistory(updatedHistory); // Update state

      // Close the modal and show a success message
      setReviewModalVisible(false);
      Alert.alert('Thank You!', 'Your review has been submitted successfully.');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error.message || 'Failed to submit your review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle going back
  const handleBack = () => {
    router.back();
  };

  // Format date to a readable string
  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return 'N/A'; // Return 'N/A' for invalid dates
    }

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'S$0.00';
    return `S$${parseFloat(amount).toFixed(2)}`;
  };

  // Render star rating input
  const renderStarRating = () => {
    return (
      <View style={styles.starRatingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setReviewRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={reviewRating >= star ? "star" : "star-outline"}
              size={30}
              color={reviewRating >= star ? "#FFD700" : "#ccc"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render each item in an order
  const renderOrderItem = (order, item) => {
    return (
      <View key={item.id} style={styles.orderItem}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
        />

        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>

          <View style={styles.itemMetaContainer}>
            {item.color && (
              <Text style={styles.itemMeta}>Color: {item.color}</Text>
            )}
            {item.size && (
              <Text style={styles.itemMeta}>Size: {item.size}</Text>
            )}
          </View>

          <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>

          {/* Show review button for ALL orders - removed delivery status check */}
          <TouchableOpacity
            style={[
              styles.reviewButton,
              item.reviewed && styles.reviewedButton
            ]}
            onPress={() => {
              if (item.reviewed) {
                if (item.reviewText) {
                  Alert.alert(
                    'Your Review',
                    `${item.reviewText}\n\nRating: ${item.reviewRating || 5}/5`
                  );
                } else {
                  Alert.alert('Already Reviewed', 'You have already reviewed this item.');
                }
              } else {
                openReviewModal(order, item);
              }
            }}
          >
            <Ionicons
              name={item.reviewed ? "checkmark-circle" : "star-outline"}
              size={16}
              color={item.reviewed ? "#fff" : "#0077b3"}
              style={styles.reviewIcon}
            />
            <Text
              style={[
                styles.reviewButtonText,
                item.reviewed && styles.reviewedButtonText
              ]}
            >
              {item.reviewed ? "Reviewed" : "Write Review"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render each order card
  const renderOrderCard = (order) => {
    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderDate}>Order placed on {formatDate(order.orderDate)}</Text>
            <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          </View>

          {/* Change the badge based on the order status */}
          <View
            style={[
              styles.statusBadge,
              order.status === 'Delivered' ? styles.deliveredBadge :
                order.status === 'Received' ? styles.receivedBadge : styles.processingBadge,
            ]}
          >
            <Text style={styles.statusText}>{order.status || 'Processing'}</Text>
          </View>
        </View>

        <View style={styles.orderDivider} />

        {/* Order items */}
        {order.items && order.items.map((item) => renderOrderItem(order, item))}

        <View style={styles.orderDivider} />

        {/* Order summary */}
        <View style={styles.orderSummary}>
          <View style={styles.orderSummaryRow}>
            <Text style={styles.orderSummaryLabel}>Total</Text>
            <Text style={styles.orderSummaryValue}>{formatCurrency(order.totalAmount)}</Text>
          </View>

          <View style={styles.orderSummaryRow}>
            <Text style={styles.orderSummaryLabel}>Payment Method</Text>
            <Text style={styles.orderSummaryValue}>{order.paymentMethod || 'Credit Card'}</Text>
          </View>

          {order.status === 'Delivered' && order.deliveryDate && (
            <View style={styles.orderSummaryRow}>
              <Text style={styles.orderSummaryLabel}>Delivered on</Text>
              <Text style={styles.orderSummaryValue}>{formatDate(order.deliveryDate)}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0077b3" />

        <View style={styles.customHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Purchase History</Text>
          <View style={styles.rightHeaderPlaceholder} />
        </View>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0077b3" />
          <Text style={styles.loaderText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />

      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Purchase History</Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View>

      {purchaseHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            You haven't made any purchases yet. Start shopping to see your orders here.
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.push('/Homepage')}
          >
            <Text style={styles.shopNowButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Your Orders</Text>
            {purchaseHistory.map(order => renderOrderCard(order))}
          </View>
        </ScrollView>
      )}

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {currentReviewItem && (
              <View style={styles.reviewItemPreview}>
                <Image
                  source={{ uri: currentReviewItem.image }}
                  style={styles.reviewItemImage}
                />
                <Text style={styles.reviewItemName}>{currentReviewItem.name}</Text>
              </View>
            )}

            <Text style={styles.reviewLabel}>Your Rating</Text>
            {renderStarRating()}

            <Text style={styles.reviewLabel}>Your Review</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience with this product..."
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              value={reviewText}
              onChangeText={setReviewText}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setReviewModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitReview}
                disabled={loading || !reviewRating || !reviewText.trim()} // Disable if inputs are invalid
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  rightHeaderPlaceholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  shopNowButton: {
    backgroundColor: '#0077b3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deliveredBadge: {
    backgroundColor: '#4CAF50',
  },
  processingBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#f3f3f3', // Background color for image placeholders
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  itemMetaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  itemMeta: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0077b3',
    marginBottom: 8,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#0077b3',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  reviewedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  reviewIcon: {
    marginRight: 5,
  },
  reviewButtonText: {
    fontSize: 12,
    color: '#0077b3',
    fontWeight: '500',
  },
  reviewedButtonText: {
    color: 'white',
  },
  orderSummary: {
    marginTop: 5,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderSummaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderSummaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  receivedBadge: {
    backgroundColor: '#4CAF50', // Green background for "Received"
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },

  // Review Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewItemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  reviewItemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  reviewItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 120,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#0077b3',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  starButton: {
    paddingHorizontal: 5, // Space between stars
  },
});