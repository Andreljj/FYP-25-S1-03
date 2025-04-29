import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const PaymentScreen = () => {
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCVC] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // UI state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveCard, setSaveCard] = useState(false);
  
  // Order summary values - in a real app these would come from your cart context
  const orderTotal = 102.99;

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiry = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue.length >= 3) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    } else if (cleanValue.length === 2) {
      return `${cleanValue}/`;
    }
    
    return cleanValue;
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (selectedPaymentMethod === 'card') {
      // Card details validation
      if (!cardholderName) {
        newErrors.cardholderName = 'Name is required';
      }
      
      if (!cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Card number is invalid';
      }
      
      if (!expiry) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        newErrors.expiry = 'Expiry date is invalid (MM/YY)';
      }
      
      if (!cvc) {
        newErrors.cvc = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(cvc)) {
        newErrors.cvc = 'CVC is invalid';
      }
    }
    
    // Address validation
    if (!country) {
      newErrors.country = 'Country is required';
    }
    
    if (!postalCode) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle payment submission
  const handlePayment = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsLoading(false);
        router.push('/Checkout');
      }, 1500);
    } else {
      // Scroll to the first error
      // This would need a ref to each input field in a real implementation
      Alert.alert("Please check your information", "There are some errors in your payment details");
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
      
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Total Card */}
          <View style={styles.orderTotalCard}>
            <Text style={styles.orderTotalLabel}>Order Total:</Text>
            <Text style={styles.orderTotalValue}>${orderTotal.toFixed(2)}</Text>
          </View>
          
          {/* Payment Method Selection */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            <TouchableOpacity 
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'card' && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod('card')}
            >
              <Ionicons 
                name="card-outline" 
                size={24} 
                color={selectedPaymentMethod === 'card' ? '#0077b3' : '#666'} 
              />
              <Text style={[
                styles.paymentMethodText,
                selectedPaymentMethod === 'card' && styles.selectedPaymentMethodText
              ]}>Credit Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'apple' && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod('apple')}
            >
              <Ionicons 
                name="logo-apple" 
                size={24} 
                color={selectedPaymentMethod === 'apple' ? '#0077b3' : '#666'} 
              />
              <Text style={[
                styles.paymentMethodText,
                selectedPaymentMethod === 'apple' && styles.selectedPaymentMethodText
              ]}>Apple Pay</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'paypal' && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod('paypal')}
            >
              <Ionicons 
                name="logo-paypal" 
                size={24} 
                color={selectedPaymentMethod === 'paypal' ? '#0077b3' : '#666'} 
              />
              <Text style={[
                styles.paymentMethodText,
                selectedPaymentMethod === 'paypal' && styles.selectedPaymentMethodText
              ]}>PayPal</Text>
            </TouchableOpacity>
          </View>
          
          {/* Contact Information */}
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput 
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
          </View>
          
          {/* Card Details - Only shown if card payment method is selected */}
          {selectedPaymentMethod === 'card' && (
            <>
              <Text style={styles.sectionTitle}>Card Details</Text>
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Cardholder Name</Text>
                  <TextInput 
                    style={[styles.input, errors.cardholderName && styles.inputError]}
                    placeholder="Name on card"
                    onChangeText={setCardholderName}
                    value={cardholderName}
                  />
                  {errors.cardholderName && <Text style={styles.errorText}>{errors.cardholderName}</Text>}
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Card Number</Text>
                  <TextInput 
                    style={[styles.input, errors.cardNumber && styles.inputError]}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="number-pad"
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    value={cardNumber}
                    maxLength={19} // 16 digits + 3 spaces
                  />
                  {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
                </View>
                
                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Expiry Date</Text>
                    <TextInput 
                      style={[styles.input, errors.expiry && styles.inputError]}
                      placeholder="MM/YY"
                      keyboardType="number-pad"
                      onChangeText={(text) => setExpiry(formatExpiry(text))}
                      value={expiry}
                      maxLength={5} // MM/YY
                    />
                    {errors.expiry && <Text style={styles.errorText}>{errors.expiry}</Text>}
                  </View>
                  
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>CVC</Text>
                    <TextInput 
                      style={[styles.input, errors.cvc && styles.inputError]}
                      placeholder="123"
                      keyboardType="number-pad"
                      onChangeText={setCVC}
                      value={cvc}
                      maxLength={4}
                      secureTextEntry={true}
                    />
                    {errors.cvc && <Text style={styles.errorText}>{errors.cvc}</Text>}
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.saveCardContainer}
                  onPress={() => setSaveCard(!saveCard)}
                >
                  <View style={[styles.checkbox, saveCard && styles.checkboxChecked]}>
                    {saveCard && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text style={styles.saveCardText}>Save card for future purchases</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          
          {/* Billing Address */}
          <Text style={styles.sectionTitle}>Billing Address</Text>
          <View style={styles.formContainer}>
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput 
                  style={[styles.input, errors.country && styles.inputError]}
                  placeholder="Country"
                  onChangeText={setCountry}
                  value={country}
                />
                {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Postal Code</Text>
                <TextInput 
                  style={[styles.input, errors.postalCode && styles.inputError]}
                  placeholder="Postal Code"
                  onChangeText={setPostalCode}
                  value={postalCode}
                />
                {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}
              </View>
            </View>
          </View>
          
          {/* Security Note */}
          <View style={styles.securityNoteContainer}>
            <Ionicons name="lock-closed" size={18} color="#666" />
            <Text style={styles.securityNoteText}>
              All transactions are secure and encrypted. Your payment information is never stored.
            </Text>
          </View>
          
          {/* Payment Button */}
          <TouchableOpacity 
            style={styles.payButton} 
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={20} color="white" style={styles.payButtonIcon} />
                <Text style={styles.payButtonText}>Pay ${orderTotal.toFixed(2)}</Text>
              </>
            )}
          </TouchableOpacity>
          
          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleBack}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0077b3',
  },
  keyboardAvoidView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  orderTotalCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  orderTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTotalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0077b3',
  },
  paymentMethodsContainer: {
    flexDirection: isWeb && width > 500 ? 'row' : 'column',
    justifyContent: isWeb && width > 500 ? 'space-between' : 'flex-start',
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 10,
    marginRight: isWeb && width > 500 ? 10 : 0,
    width: isWeb && width > 500 ? (width > 700 ? '30%' : '48%') : '100%',
  },
  selectedPaymentMethod: {
    borderColor: '#0077b3',
    backgroundColor: 'rgba(0, 119, 179, 0.05)',
  },
  paymentMethodText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#666',
  },
  selectedPaymentMethodText: {
    fontWeight: '500',
    color: '#0077b3',
  },
  formContainer: {
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
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 5,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0077b3',
    borderColor: '#0077b3',
  },
  saveCardText: {
    fontSize: 14,
    color: '#666',
  },
  securityNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityNoteText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  payButton: {
    backgroundColor: '#0077b3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  payButtonIcon: {
    marginRight: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default PaymentScreen;