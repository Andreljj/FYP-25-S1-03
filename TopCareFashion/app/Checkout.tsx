import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function CheckoutSuccessScreen() {
  const router = useRouter();

  const handleReviewClick = () => {
    router.push('/Rating');
  };

  const navigateHome = () => {
    router.push('/');
  };

  const viewOrderDetails = () => {
    // In a real app this would go to order details screen
    router.push('/orders');
  };

  // Order details - would come from your order state/context in a real app
  const orderDetails = {
    orderNumber: "#A83729501",
    orderDate: new Date().toLocaleDateString(),
    paymentMethod: "Credit Card (ending in 4242)",
    totalAmount: "S$102.99",
    estimatedDelivery: "May 15 - May 20"
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
      
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <View style={styles.leftHeaderPlaceholder} />
        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <TouchableOpacity onPress={navigateHome}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successIconContainer}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={50} color="white" />
          </View>
        </View>
        
        <Text style={styles.thankYouText}>Thank You!</Text>
        <Text style={styles.confirmationText}>Your order has been placed successfully</Text>
        
        <View style={styles.orderInfoCard}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order Number:</Text>
            <Text style={styles.orderInfoValue}>{orderDetails.orderNumber}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order Date:</Text>
            <Text style={styles.orderInfoValue}>{orderDetails.orderDate}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Payment Method:</Text>
            <Text style={styles.orderInfoValue}>{orderDetails.paymentMethod}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Total Amount:</Text>
            <Text style={styles.orderInfoValue}>{orderDetails.totalAmount}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Estimated Delivery:</Text>
            <Text style={styles.orderInfoValue}>{orderDetails.estimatedDelivery}</Text>
          </View>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://cdn.dribbble.com/users/1554226/screenshots/5453701/media/16e020df44c539593c4058565230d839.jpg?compress=1&resize=768x576&vertical=top' }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.feedbackTitle}>How was your shopping experience?</Text>
        <Text style={styles.feedbackText}>
          Your feedback helps us improve our service for everyone.
        </Text>
        
        <TouchableOpacity style={styles.reviewButton} onPress={handleReviewClick}>
          <Ionicons name="star" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.reviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.orderDetailsButton} onPress={viewOrderDetails}>
          <Ionicons name="receipt-outline" size={20} color="#0077b3" style={styles.buttonIcon} />
          <Text style={styles.orderDetailsButtonText}>View Order Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.continueShoppingButton} onPress={navigateHome}>
          <Ionicons name="home-outline" size={20} color="#666" style={styles.buttonIcon} />
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
        
        <View style={styles.confirmationNote}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <Text style={styles.confirmationNoteText}>
            A confirmation email has been sent to your registered email address
          </Text>
        </View>
      </ScrollView>
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
  leftHeaderPlaceholder: {
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  successIconContainer: {
    marginBottom: 25,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  thankYouText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  orderInfoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: isWeb ? 400 : width - 40,
    height: 250,
    borderRadius: 10,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  reviewButton: {
    backgroundColor: '#0077b3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
  },
  buttonIcon: {
    marginRight: 8,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetailsButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0077b3',
    marginBottom: 15,
    width: '100%',
    maxWidth: 300,
  },
  orderDetailsButtonText: {
    color: '#0077b3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueShoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 30,
  },
  continueShoppingText: {
    color: '#666',
    fontSize: 16,
  },
  confirmationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    maxWidth: 500,
  },
  confirmationNoteText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#666',
  },
});