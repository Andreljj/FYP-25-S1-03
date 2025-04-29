import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  Dimensions, 
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from './context/CartContext';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, removeFromCart } = useCart();
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + ((item.discountedPrice || item.price) * item.quantity), 0);
  };

  // Calculate platform fee (fixed 30 cents)
  const calculatePlatformFee = () => {
    return 0.30; // 30 cents fixed platform fee
  };

  // Calculate shipping (free over $50)
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 4.99;
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const platformFee = calculatePlatformFee();
    return subtotal + shipping + platformFee;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
      // Try to parse it as a number if it's a string
      const parsed = parseFloat(amount);
      if (isNaN(parsed)) {
        return 'S$0.00'; // Fallback if parsing fails
      }
      amount = parsed;
    }
    return `S$${amount.toFixed(2)}`;
  };
  
  // Handle checkout
  const handleCheckout = () => {
    router.push('/Payment');
  };
  
  // Continue shopping
  const continueShopping = () => {
    router.push('/Homepage');
  };
  
  // Handle back button
  const handleBack = () => {
    router.back();
  };
  
  // Empty cart component
  const EmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
      <Text style={styles.emptyCartText}>Looks like you haven't added anything to your cart yet.</Text>
      <TouchableOpacity 
        style={styles.continueShoppingButton}
        onPress={continueShopping}
      >
        <Text style={styles.continueShoppingButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
      
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View>
      
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <View style={styles.container}>
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Cart Items */}
            <View style={styles.cartItemsContainer}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.itemContainer}>
                  {/* Product Image */}
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  
                  {/* Item Details */}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemColorSize}>
                      {item.color && `Color: ${item.color}`}
                      {item.color && item.size && ' • '}
                      {item.size && `Size: ${item.size}`}
                    </Text>
                    
                    {/* Price Display */}
                    <View style={styles.priceContainer}>
                      <Text style={styles.discountedPrice}>
                        {formatCurrency(item.discountedPrice || item.price)}
                      </Text>
                      {item.discountedPrice && item.price && (
                        <Text style={styles.originalPrice}>{formatCurrency(item.price)}</Text>
                      )}
                      {item.discount > 0 && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>{item.discount}% OFF</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Remove Button - Fixed implementation */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ff3b30" />
                        <Text style={[styles.actionButtonText, styles.removeText]}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            
            {/* Order Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</Text>
                <Text style={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform Fee</Text>
                <Text style={styles.summaryValue}>{formatCurrency(calculatePlatformFee())}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                {calculateShipping() === 0 ? (
                  <Text style={styles.freeShippingText}>FREE</Text>
                ) : (
                  <Text style={styles.summaryValue}>{formatCurrency(calculateShipping())}</Text>
                )}
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(calculateTotal())}</Text>
              </View>
              
              <Text style={styles.taxNote}>
                *Platform fee helps maintain our services and secure transactions
              </Text>
            </View>
          </ScrollView>
          
          {/* Checkout Section */}
          <View style={styles.checkoutContainer}>
            <TouchableOpacity
              style={styles.continueShoppingButtonSmall}
              onPress={continueShopping}
            >
              <Text style={styles.continueShoppingTextSmall}>Continue Shopping</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for fixed checkout button
  },
  cartItemsContainer: {
    padding: 15,
  },
  itemContainer: {
    flexDirection: isWeb && width > 600 ? 'row' : 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: isWeb && width > 600 ? 100 : '100%',
    height: isWeb && width > 600 ? 100 : 200,
    borderRadius: 8,
    marginRight: isWeb && width > 600 ? 15 : 0,
    marginBottom: isWeb && width > 600 ? 0 : 15,
    resizeMode: 'cover'
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemColorSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077b3',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  actionButtonText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#0077b3',
  },
  removeText: {
    color: '#ff3b30',
  },
  summaryContainer: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  freeShippingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4caf50',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff3b30',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077b3',
  },
  taxNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 15,
    flexDirection: isWeb && width > 500 ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: isWeb && width > 500 ? 'center' : 'stretch',
  },
  continueShoppingButtonSmall: {
    padding: 8,
    marginBottom: isWeb && width > 500 ? 0 : 10,
  },
  continueShoppingTextSmall: {
    color: '#0077b3',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#0077b3',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: '#0077b3',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 8,
  },
  continueShoppingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});