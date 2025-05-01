import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from '../context/AuthContext';


// Sample FAQ data
const initialFAQData = [
  {
    id: "1",
    question: "How do I create an account?",
    answer: "To create an account, tap on the profile icon in the top-right corner of the screen and select 'Register'. Follow the prompts to enter your details and create your TOP CARE FASHION account."
  },
  {
    id: "2",
    question: "How can I track my order?",
    answer: "After logging in, navigate to 'My Orders' in your account dashboard. You'll find tracking information for all your recent orders there, including delivery status and estimated arrival dates."
  },
  {
    id: "3",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on all unworn items with original tags attached. Returns can be initiated through your account dashboard. Please note that sale items and intimates are final sale and cannot be returned."
  },
  {
    id: "4",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. International shipping times and rates vary by location. You can see the estimated shipping cost at checkout before completing your purchase."
  },
  {
    id: "5",
    question: "How can I contact customer support?",
    answer: "You can reach our customer support team through the 'Contact Us' form in the app, via email at support@topcarefashion.com, or by phone at +1-800-FASHION during business hours (Monday-Friday, 9am-5pm EST)."
  },
  {
    id: "6",
    question: "Are there any membership benefits?",
    answer: "Yes! Members earn points on every purchase, get access to exclusive sales, and receive special birthday offers. Higher membership tiers unlock additional benefits like free shipping and early access to new collections."
  }
];

// FAQItem Component - Simplified without animations to reduce possible errors
const FAQItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity 
        style={styles.questionContainer} 
        onPress={() => setExpanded(!expanded)} 
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{item.question}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#0077b3" 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

// Query Form component - this is the popup form
const QueryForm = ({ visible, onClose, onSubmit }) => {
  const [queryData, setQueryData] = useState({
    topic: '',
    message: '',
    email: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useAuth?.() || { isAuthenticated: false };

  const validateForm = () => {
    const newErrors = {};
    
    if (!queryData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    
    if (!queryData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (queryData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    if (!isAuthenticated) {
      if (!queryData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(queryData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!queryData.name.trim()) {
        newErrors.name = 'Name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(queryData);
      setQueryData({ topic: '', message: '', email: '', name: '' });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Submit Your Query</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.formContainer}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Topic/Subject<Text style={styles.required}>*</Text></Text>
                    <View style={[styles.inputContainer, errors.topic ? styles.inputError : null]}>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Order Issue, Product Question, etc."
                        placeholderTextColor="#999"
                        value={queryData.topic}
                        onChangeText={(text) => {
                          setQueryData({...queryData, topic: text});
                          setErrors({...errors, topic: undefined});
                        }}
                      />
                    </View>
                    {errors.topic && <Text style={styles.errorText}>{errors.topic}</Text>}
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Your Message<Text style={styles.required}>*</Text></Text>
                    <View style={[styles.inputContainer, errors.message ? styles.inputError : null]}>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Please describe your query in detail..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        value={queryData.message}
                        onChangeText={(text) => {
                          setQueryData({...queryData, message: text});
                          setErrors({...errors, message: undefined});
                        }}
                      />
                    </View>
                    {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
                  </View>
                  
                  {!isAuthenticated && (
                    <>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Your Name<Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, errors.name ? styles.inputError : null]}>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor="#999"
                            value={queryData.name}
                            onChangeText={(text) => {
                              setQueryData({...queryData, name: text});
                              setErrors({...errors, name: undefined});
                            }}
                          />
                        </View>
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                      </View>
                      
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Email Address<Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter your email address"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            value={queryData.email}
                            onChangeText={(text) => {
                              setQueryData({...queryData, email: text});
                              setErrors({...errors, email: undefined});
                            }}
                          />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                      </View>
                    </>
                  )}
                  
                  <Text style={styles.note}>
                    {isAuthenticated 
                      ? "Your account details will be used to contact you about this query."
                      : "Please provide your contact information so we can respond to your query."}
                  </Text>
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.button, styles.submitButton]} 
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit Query</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function FAQScreen() {
  const router = useRouter();
  const [queryModalVisible, setQueryModalVisible] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle query submission
  const handleQuerySubmit = (data) => {
    console.log("Query submitted:", data);
    // Here you would typically send the data to your API
    // For now, we'll just simulate a successful submission
    setQueryModalVisible(false);
    setSubmitSuccess(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Use the NavigationBar component instead of the separate header and nav bar */}
      <NavigationBar 
        activeTab="FAQ"
        showBackButton={true}
      />

      {/* FAQ Content */}
      <ScrollView style={styles.container}>

	//added

	{isAdmin && (
	  <View style={{ margin: 15 }}>
	    <TouchableOpacity 	
    		  style={[styles.contactButton, { marginBottom: 10 }]}
    	  	onPress={() => {
        	setEditedData(faqData);
        	setIsEditing(!isEditing);
      	}}
	    >
      <Text style={styles.contactButtonText}>{isEditing ? 'Cancel Edit' : 'Edit FAQ'}</Text>
    </TouchableOpacity>

    {isEditing && (
      <>
        {editedData.map((item, index) => (
          <View key={item.id} style={{ marginBottom: 15 }}>
            <TextInput
              style={styles.input}
              placeholder="Question"
              value={item.question}
              onChangeText={(text) => {
                const updated = [...editedData];
                updated[index].question = text;
                setEditedData(updated);
              }}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              placeholder="Answer"
              value={item.answer}
              onChangeText={(text) => {
                const updated = [...editedData];
                updated[index].answer = text;
                setEditedData(updated);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                const updated = editedData.filter((_, i) => i !== index);
                setEditedData(updated);
              }}
              style={{ marginTop: 5 }}
            >
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity
          style={[styles.contactButton, { marginVertical: 10 }]}
          onPress={() => setEditedData([...editedData, {
            id: String(Date.now()),
            question: '',
            answer: ''
          }])}
        >
          <Text style={styles.contactButtonText}>+ Add FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            setFaqData(editedData);
            setIsEditing(false);
          }}
        >
          <Text style={styles.contactButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
)}

	

        <Text style={styles.title}>Frequently Asked Questions</Text>
        
	{!isEditing && faqData.map((faq) => (
  		<FAQItem key={faq.id} item={faq} />
	))}

        
        {/* Submit Query Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Can't find what you're looking for?</Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => setQueryModalVisible(true)}
          >
            <Text style={styles.contactButtonText}>Submit Query</Text>
          </TouchableOpacity>
        </View>
        
        {/* Success Message */}
        {submitSuccess && (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.successText}>
              Your query has been submitted successfully! We'll get back to you soon.
            </Text>
          </View>
        )}
        
        {/* Extra space at the bottom for better scrolling */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Query Form Modal */}
      <QueryForm 
        visible={queryModalVisible}
        onClose={() => setQueryModalVisible(false)}
        onSubmit={handleQuerySubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: "#0077b3" 
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f8f8f8" 
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0077b3",
    marginVertical: 20,
    marginHorizontal: 15,
  },
  faqItem: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "white",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    paddingRight: 10,
    color: "#333",
  },
  answerContainer: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  answerText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },
  contactSection: {
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  contactButton: {
    backgroundColor: "#0077b3",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  contactButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077b3',
  },
  formContainer: {
    padding: 15,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  required: {
    color: '#ff3b30',
    marginLeft: 3,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  input: {
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  note: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#0077b3',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  // Success message styles
  successContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    color: '#2e7d32',
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
});